import { extractTodoItems, handleSaveChatTodo } from "@/app/api/lib/\bchatTodoItemUtils";
import { formatTodoList, getTodoRequestType } from "@/app/api/lib/todoPatterns";
import { CHAT_SESSIONS } from "@/lib/tableNames";
import openai from "@/lib/utils/openaiClient";
import { Chat, ChatSession, Message } from "@/types/chat.session.type";
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
      .eq("ai_type", "assistant")
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

  const { message, saveTodo } = await request.json();

  if (saveTodo) {
    try {
      const result = await handleSaveChatTodo(supabase, sessionId);
      if (result.success) {
        return NextResponse.json({ message: result.message });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "An error occurred while saving todo list." }, { status: 500 });
    }
  }

  const todoRequestType = getTodoRequestType(message);
  // const isTodoRequest = message.includes("투두리스트에 추가 :") || message === "투두리스트를 작성하고 싶어요.";
  let showSaveButton = todoRequestType === "start" || todoRequestType === "add" || todoRequestType === "list";
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

    let systemMessage: string;
    if (message.toLowerCase().includes("다른 투두리스트") || message.toLowerCase().includes("새로운 투두리스트")) {
      systemMessage =
        "사용자가 새로운 투두리스트를 작성하려고 합니다. '네, 새로운 투두리스트를 작성하겠습니다. 어떤 항목들을 추가하고 싶으신가요?'라고 안내해주세요.";
      showSaveButton = false;
    } else {
      switch (todoRequestType) {
        case "start":
          systemMessage =
            "사용자가 투두를 시작하려고 합니다. '네,원하는 투두리스트를 작성해주세요. 각 항목을 쉼표로 구분해 입력해주세요.'라고 안내해주세요.";
          break;
        case "add":
        case "list":
          systemMessage =
            "사용자가 투두리스트 항목을 제시했습니다. 각 항목을 별도의 줄에 나열해주세요. 글머리 기호나 번호를 사용하지 말고, 항목 내용만 나열해주세요. 예를 들어:\n\n항목1\n\n항목2\n\n항목3";
          break;
        default:
          systemMessage = "일반적인 대화를 계속해주세요.";
          showSaveButton = false;
      }
    }

    // Open API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...messages.map(
          (m): ChatCompletionMessageParam => ({ role: m.role as "system" | "user" | "assistant", content: m.content })
        ),
        {
          role: "system",
          content: systemMessage
        },
        { role: "user", content: message }
      ] as ChatCompletionMessageParam[]
    });

    // console.log("OpenAI API Response", completion);

    let aiResponse = completion.choices[0].message.content;
    let todoItems: string[] = [];

    if (todoRequestType === "add" || todoRequestType === "list") {
      const items = extractTodoItems(aiResponse ?? "");
      // console.log("items", items);
      todoItems = items ?? [];
      if (items.length > 0) {
        aiResponse = `정리 된 투두리스트:\n${formatTodoList(items ?? [])}`;
        aiResponse += "\n\n나열된 내용을 투두리스트에 추가하고 싶다면 '저장하기' 버튼을 눌러주세요";
        showSaveButton = true;
      } else {
        showSaveButton = false;
      }
    }
    const aiMessage: Message = { role: "assistant", content: aiResponse ?? "", created_at: new Date().toISOString() };
    messages.push(aiMessage);

    // 업데이트 된 매시지 저장
    const { error: updatedError } = await supabase
      .from(CHAT_SESSIONS)
      .update({
        messages: messages,
        updated_at: new Date().toISOString()
      })
      .eq("session_id", sessionId)
      .eq("ai_type", "assistant");

    if (updatedError) {
      console.error("Error updating session", updatedError);
      return NextResponse.json({ error: "Failed to updated session" }, { status: 500 });
    }

    return NextResponse.json({
      message: [{ ...userMessage }, { ...aiMessage, showSaveButton }]
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
