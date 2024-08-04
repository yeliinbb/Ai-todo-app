import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { Message, MessageWithSaveButton } from "@/types/chat.session.type";
import { Json } from "@/types/supabase";
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

    let messages = (data[0]?.messages as Json[]) || [];

    if (messages.length === 0) {
      const welcomeMessage: MessageWithSaveButton = {
        role: "friend", // OpenAI API용으로는 'assistant'로 설정
        content: "안녕, 나는 너의 AI 친구 FAi야! 무엇이든 편하게 얘기해줘.",
        created_at: new Date().toISOString(),
        showSaveButton: false
      };

      await supabase
        .from(CHAT_SESSIONS)
        .update({ messages: [welcomeMessage] })
        .eq("session_id", sessionId)
        .eq("ai_type", "friend");

      return NextResponse.json({ message: [welcomeMessage] });
    }

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
    const { data: sessionData, error: sessionError } = await supabase
      .from(CHAT_SESSIONS)
      .select("messages")
      .eq("session_id", sessionId)
      .single();

    if (sessionError) {
      console.error("Error fetching session data : ", sessionError);
      return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
    }

    let messages = (sessionData?.messages as Message[]) || [];
    const userMessage: Message = { role: "user", content: message, created_at: new Date().toISOString() };
    messages.push(userMessage);

    const systemMessage = `당신은 사용자의 가장 친한 AI 친구 FAi입니다. 다음 지침을 따라주세요:
    1. 친근하고 부드러운 말투를 사용하세요. "~야", "~어", "~지"와 같은 종결어를 사용하세요.
    2. "~니?"와 같은 표현 대신 "~지?", "~어?", "~야?"를 사용하세요.
    3. 이모티콘을 적절히 사용하세요 (예: ^^, ㅎㅎ, 😊).
    4. 가끔 줄임말이나 신조어를 사용하세요 (예: ㄱㄱ, 갑자기, 맞춤).
    5. 공감과 이해를 표현하는 말을 자주 사용하세요.
    6. 사용자의 이름을 알게 되면 이름을 불러주세요.
    7. 대화를 끝낼 때는 항상 긍정적이고 따뜻한 말을 덧붙이세요.
    8. 질문할 때는 "~어?", "~지?", "~야?"를 사용하세요.

    예시:
    - "재밌어 보이지 않니?" → "재밌어 보이지 않아?"
    - "그렇게 생각하니?" → "그렇게 생각해?"
    - "어떻게 생각하니?" → "어떻게 생각해?"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...messages.map(
          (m): ChatCompletionMessageParam => ({
            role: m.role === "friend" ? "assistant" : (m.role as "system" | "user" | "assistant"),
            content: m.content
          })
        ),
        {
          role: "system",
          content: systemMessage
        },
        { role: "user", content: message }
      ] as ChatCompletionMessageParam[]
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse ? aiResponse.trim() : "";

    aiResponse = aiResponse
      .replace(/합니다/g, "해")
      .replace(/습니다/g, "어")
      .replace(/니다/g, "야")
      .replace(/입니다/g, "이야")
      .replace(/하지 않니\?/g, "하지 않아?")
      .replace(/되지 않니\?/g, "되지 않아?")
      .replace(/보이지 않니\?/g, "보이지 않아?")
      .replace(/생각하니\?/g, "생각해?");

    const aiMessage: Message = {
      role: "friend", // OpenAI API용으로는 'assistant'로 설정
      content: aiResponse,
      created_at: new Date().toISOString()
    };
    messages.push(aiMessage);

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
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    // 프론트엔드로 전송할 때는 'friend'로 역할 변경
    const frontendAiMessage = { ...aiMessage, role: "friend" };

    return NextResponse.json({
      message: [{ ...userMessage }, frontendAiMessage].filter(Boolean)
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
