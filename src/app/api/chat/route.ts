import { CHAT_SESSIONS, MESSAGES_ASSISTANT_TABLE } from "@/lib/tableNames";
import openai from "@/lib/utils/openaiClient";
import { Chat, ChatSession, Message } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();
  const sessionId = cookies().get("sessionId")?.value;

  //   const {data : {user} , error : authError} = await supabase.auth.getUser();
  //   if(authError || !user) {
  //     return NextResponse.json({error : "Unauthorized"}, {status : 401})
  //   }

  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from(CHAT_SESSIONS)
      .select("messages")
      .eq("session_id", sessionId)
      // .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const messages: ChatSession["messages"] = data?.messages || [];
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error : ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  const supabase = createClient();
  const sessionId = cookies().get("sessionId")?.value;
  // console.log("Received POST request", request); // request 데이터 타입 형식 확인 필요

  //   const {data : {user} , error : authError} = await supabase.auth.getUser();
  //   if(authError || !user) {
  //     return NextResponse.json({error : "Unauthorized"}, {status : 401})
  //   }

  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const { message } = await request.json();

  try {
    // 사용자 메시지 저장
    const { data: sessionData, error: sessionError } = await supabase
      .from(CHAT_SESSIONS)
      .select("messages")
      .eq("session_id", sessionId)
      // .eq("user_id", user.id)
      .single();
    // console.log("Saving user message to Supabase", userData);

    if (sessionError) throw sessionError;

    let messages: Message[] = sessionData?.messages || [];
    messages.push({ role: "user", content: message, created_at: new Date().toISOString() });

    // Open API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((m) => ({ role: m.role, content: message }))
    });
    console.log("Calling OpenAI API", completion);
    const aiResponse = completion.choices[0].message.content;
    messages.push({ role: "assistant", content: aiResponse, created_at: new Date().toISOString() });

    // AI 응답 저장
    const { error: updatedError } = await supabase
      .from(CHAT_SESSIONS)
      .update({
        messages: messages,
        updated_at: new Date().toISOString()
      })
      .eq("session_id", sessionId);
    // .eq("user_id", user.id)

    if (updatedError) throw updatedError;
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
