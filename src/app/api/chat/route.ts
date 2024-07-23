import { MESSAGES_ASSISTANT_TABLE } from "@/lib/tableNames";
import openai from "@/lib/utils/openaiClient";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from(MESSAGES_ASSISTANT_TABLE)
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error : ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  const supabase = createClient();
  console.log("Received POST request", request); // request 데이터 타입 형식 확인 필요
  const { message } = await request.json();

  try {
    // 사용자 메시지 저장
    const { data: userData, error: userError } = await supabase
      .from(MESSAGES_ASSISTANT_TABLE)
      .insert({ role: "user", content: message })
      .select();
    console.log("Saving user message to Supabase", userData);
    if (userError) throw userError;

    // Open API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });
    console.log("Calling OpenAI API", completion);
    const aiResponse = completion.choices[0].message.content;

    // AI 응답 저장
    const { data: aiData, error: aiError } = await supabase
      .from(MESSAGES_ASSISTANT_TABLE)
      .insert({ role: "ai", content: aiResponse });
    console.log("Saving AI response to Supabase", aiData);
    if (aiError) throw aiError;
    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
