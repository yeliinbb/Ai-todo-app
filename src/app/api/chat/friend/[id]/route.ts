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
        created_at: new Date().toISOString()
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

  const { message, saveDiary } = await request.json();

  try {
    if (saveDiary) {
      // 일기 저장 로직
      const { data, error } = await supabase
        .from("diaries")
        .insert({ session_id: sessionId, content: JSON.stringify({ content: message }) })
        .single();

      if (error) {
        console.error("Error saving diary:", error);
        return NextResponse.json({ error: "Failed to save diary" }, { status: 500 });
      }

      return NextResponse.json({ message: "Diary saved successfully", data });
    }

    // 기존의 채팅 로직
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

    const systemMessage = `당신은 사용자의 가장 친한 AI 친구 FAi(파이)입니다. 다음 지침을 따라주세요:
    1. 친근하고 부드러운 말투를 사용하세요. "~야", "~어", "~지"와 같은 종결어를 사용하세요.
    2. "~니?"와 같은 표현 대신 "~지?", "~어?", "~야?"를 사용하세요.
    3. 이모티콘을 적절히 사용하세요. 다음과 같은 이모티콘을 활용하세요:
      😊 (미소), 😄 (활짝 웃는 얼굴), 🤗 (포옹), 😎 (멋짐), 🤔 (생각하는 얼굴), 
      😅 (쑥스러운 웃음), 👍 (엄지척), 💖 (반짝이는 하트), 🙌 (만세)
    4. 가끔 줄임말이나 신조어를 사용하세요 (예: ㄱㄱ, 갑자기, 맞춤).
    5. 공감과 이해를 표현하는 말을 자주 사용하세요.
    6. 사용자의 이름을 알게 되면 이름을 불러주세요.
    7. 대화를 끝낼 때는 항상 긍정적이고 따뜻한 말을 덧붙이세요.
    8. 질문할 때는 "~어?", "~지?", "~야?"를 사용하세요.
    9. 만약 사용자가 오늘 하루에 대해 이야기하면, 그 내용을 바탕으로 간단한 일기를 작성해주세요.
    10. 일기를 작성할때는 사용자가 보낸 채팅을 기반으로 "~했다", "~였다", "~다"만 사용하고 사용자 시점에서 일기를 작성해주세요. 
    11. 사용자가 오늘 하루에 대해 이야기하면, 그 내용을 바탕으로 사용자의 시점에서 일기를 작성해주세요.
    12. 일기 내용은 사용자의 시점에서 작성하되, 좀 더 객관적이고 서술적인 톤을 유지하세요.`;

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

    // POST 함수 내부
    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse ? aiResponse.trim() : "";

    // "일기를 작성해줘" 메시지에 대한 응답
    if (message === "일기를 작성해줘") {
      aiResponse = "오늘 하루는 어땠어? 어떤 일들이 있었는지 얘기해줄래? 😊";
    }
    // 사용자가 하루에 대해 이야기한 후의 응답
    else if (messages[messages.length - 2]?.content === "오늘 하루는 어땠어? 어떤 일들이 있었는지 얘기해줄래? 😊") {
      // AI의 응답을 사용자 시점의 일기 형식으로 변환
      let diaryContent = aiResponse.trim();

      const changeEnding = (sentence: string): string => {
        return sentence
          .replace(/([았었겠])어\./g, "$1다.")
          .replace(/([이가])야\./g, "$1다.")
          .replace(/([이가])네\./g, "$1다.")
          .replace(/([이가])지\./g, "$1다.")
          .replace(/([다])어\./g, "$1.");
      };

      diaryContent = diaryContent
        .split(". ")
        .map((sentence) => changeEnding(sentence + "."))
        .join(" ");

      // 날짜 추가
      const today = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
      });
      diaryContent = `${today}\n\n${diaryContent}`;

      aiResponse = `네가 얘기해준 내용을 바탕으로 일기를 작성해봤어. 어때, 맘에 들어? 😊\n\n${diaryContent}`;
    }

    const aiMessage: Message = {
      role: "friend",
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

    const frontendAiMessage = { ...aiMessage, role: "friend" };

    return NextResponse.json({
      message: [{ ...userMessage }, frontendAiMessage].filter(Boolean)
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
