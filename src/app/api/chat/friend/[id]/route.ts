import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { Chat, ChatSession, Message } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();

  const { id: sessionId } = params;

  try {
    const { data, error } = await supabase
      .from(CHAT_SESSIONS)
      .select("messages")
      .eq("session_id", sessionId)
      .eq("ai_type", "friend")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // console.log("data", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error : ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id: sessionId } = params;

  const { message } = await request.json();

  try {
    // 사용자 메시지 저장
    const { data: sessionData, error: sessionError } = await supabase
      .from(CHAT_SESSIONS)
      .select("messages")
      .eq("session_id", sessionId)
      .single();

    // console.log("Saving user message to Supabase", userData);

    if (sessionError) {
      console.error("Error fetching session data : ", sessionError);
      return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
    }

    let messages = (sessionData?.messages as Message[]) || [];
    const userMessage: Message = { role: "user", content: message, created_at: new Date().toISOString() };
    messages.push(userMessage);

    // Open API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((m) => ({
        role: m.role === "friend" ? "assistant" : m.role,
        content: m.content
      }))
    });

    console.log("OpenAI API Response", completion);

    const aiResponse = completion.choices[0].message.content;
    const aiMessage: Message = { role: "friend", content: aiResponse ?? "", created_at: new Date().toISOString() };
    messages.push(aiMessage);

    // 업데이트 된 매시지 저장
    const { error: updatedError } = await supabase
      .from(CHAT_SESSIONS)
      .update({
        messages: messages,
        updated_at: new Date().toISOString()
      })
      .eq("session_id", sessionId)
      .eq("ai_type", "friend");

    if (updatedError) {
      console.error("Error updating session", updatedError);
      return NextResponse.json({ error: "Failed to updated session" }, { status: 500 });
    }

    return NextResponse.json({ message: [userMessage, aiMessage] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
