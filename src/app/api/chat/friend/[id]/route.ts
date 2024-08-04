import { Json } from "@/types/supabase";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { Message, MessageWithSaveButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

    let messages = (data[0]?.messages as Message[]) || [];

    if (messages.length === 0) {
      const welcomeMessages: Message[] = [
        {
          role: "friend",
          content: "안녕, 나는 너의 AI 친구 FAi야. 필요한게 있다면 뭐든 얘기해줘!",
          created_at: new Date().toISOString()
        },
        {
          role: "friend",
          content: "일기 작성, 오늘 하루에 대한 이야기를 나눌수있어.",
          created_at: new Date(Date.now() + 1).toISOString()
        },
        {
          role: "friend",
          content: "일기를 작성하려면 아래 '일기 작성하기' 버튼을 눌러줘.",
          created_at: new Date(Date.now() + 2).toISOString()
        }
      ];

      await supabase
        .from(CHAT_SESSIONS)
        .update({ messages: welcomeMessages })
        .eq("session_id", sessionId)
        .eq("ai_type", "friend");

      return NextResponse.json({
        message: [...welcomeMessages].filter(Boolean)
      });
    }

    console.log("data", data);

    return NextResponse.json({ message: messages });
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
      messages: [
        ...messages.map(
          (m): ChatCompletionMessageParam => ({ role: m.role as "system" | "user" | "assistant", content: m.content })
        ),
        { role: "user", content: message }
      ] as ChatCompletionMessageParam[]
    });

    let aiResponse = completion.choices[0].message.content;
    console.log("OpenAI API Response", completion.choices[0].message);
    aiResponse = aiResponse ? aiResponse.replace(/^[•*]\s*|\d+\.\s*/gm, "").trim() : "";
    console.log("=========================");
    console.log("aiResponse => ", aiResponse);

    const aiMessage: Message = {
      role: "friend",
      content: aiResponse ?? "",
      created_at: new Date().toISOString()
    };
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

    return NextResponse.json({
      message: [{ ...userMessage }, { ...aiMessage }].filter(Boolean)
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
