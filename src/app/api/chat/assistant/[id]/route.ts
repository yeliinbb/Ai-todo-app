import { extractTodoItems, handleSaveChatTodo } from "@/app/api/lib/chatTodoItemUtils";
import { formatTodoList, getTodoRequestType } from "@/app/api/lib/todoPatterns";
import { CHAT_SESSIONS } from "@/lib/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { Chat, ChatSession, Message, MessageWithSaveButton } from "@/types/chat.session.type";
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
      .eq("ai_type", "assistant")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let messages = (data[0]?.messages as Json[]) || [];

    if (messages.length === 0) {
      const welcomeMessage: MessageWithSaveButton = {
        role: "assistant",
        content: "안녕하세요, 저는 당신의 AI 비서 PAi입니다. 필요하신 게 있다면 저에게 말씀해주세요.",
        created_at: new Date().toISOString(),
        showSaveButton: false
      };

      // 웰컴 메시지 여러 개인 경우
      const welcomeMessages: MessageWithSaveButton[] = [
        {
          role: "assistant",
          content: "안녕하세요, 저는 당신의 AI 비서 PAi입니다. 필요하신 게 있다면 저에게 말씀해주세요.",
          created_at: new Date().toISOString(),
          showSaveButton: false
        },
        {
          role: "assistant",
          content: "투두리스트 작성, 일정 관리, 간단한 질문 답변 등 다양한 업무를 도와드릴 수 있습니다.",
          created_at: new Date(Date.now() + 1).toISOString(), // 1ms 후의 시간으로 설정
          showSaveButton: false
        },
        {
          role: "assistant",
          content: "어떤 도움이 필요하신가요?",
          created_at: new Date(Date.now() + 2).toISOString(), // 2ms 후의 시간으로 설정
          showSaveButton: false
        }
      ];

      // 웰컴 메시지를 데이터베이스에 저장
      await supabase
        .from(CHAT_SESSIONS)
        .update({ messages: [welcomeMessage] })
        .eq("session_id", sessionId)
        .eq("ai_type", "assistant");

      return NextResponse.json({
        message: [{ ...welcomeMessage }].filter(Boolean)
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
  let showSaveButton = false;
  let systemMessage: string;

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

    // systemMessage 설정
    if (message.toLowerCase().includes("다른 투두리스트") || message.toLowerCase().includes("새로운 투두리스트")) {
      systemMessage =
        "사용자가 새로운 투두리스트를 작성하려고 합니다. '네, 새로운 투두리스트를 작성하겠습니다. 어떤 항목들을 추가하고 싶으신가요?'라고 안내해주세요.";
    } else {
      switch (todoRequestType) {
        case "create":
          systemMessage =
            "사용자가 투두리스트를 작성하려고 합니다. '네, 원하는 투두리스트를 작성해주세요. 각 항목을 쉼표로 구분해 입력해주세요.'라고 안내해주세요.";
        case "start":
          systemMessage =
            "사용자가 투두를 시작하려고 합니다. '네,원하는 투두리스트를 작성해주세요. 각 항목을 쉼표로 구분해 입력해주세요.'라고 안내해주세요.";
          break;
        case "add":
          systemMessage =
            "사용자가 투두리스트에 항목을 추가하려고 합니다. 새로운 항목을 기존 리스트에 추가하고, 전체 리스트를 보여주세요. 각 항목을 별도의 줄에 나열하고, 글머리 기호나 번호를 사용하지 마세요. 리스트만 나열하고 다른 이야기는 하지 않도록 하세요. 추가되었다는 이야기도 할 필요 없습니다.";
          break;
        case "list":
          systemMessage =
            "사용자가 전체 투두리스트를 작성하려고 합니다. 제시된 모든 항목을 포함하는 리스트를 만들어주세요. 각 항목을 별도의 줄에 나열하고 글머리 기호나 번호를 사용하지 말고, 항목 내용만 나열해주세요. 리스트만 나열하고 다른 이야기는 하지 않도록 하세요. 추가되었다는 이야기도 할 필요 없습니다. 예를 들어:\n항목1\n항목2\n항목3";
          break;
        default:
          systemMessage = "일반적인 대화를 계속해주세요.";
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

    // showSaveButton 결정 및 투두 항목 정리
    if (todoRequestType === "start" || todoRequestType === "add" || todoRequestType === "list") {
      const items = extractTodoItems(aiResponse ?? "");
      // console.log("items", items);
      todoItems = items ?? [];
      if (items.length > 0) {
        aiResponse = `정리 된 투두리스트 :\n${formatTodoList(items ?? [])}`;
        showSaveButton = true; // 실제 투두 항목이 있을 때만 저장 버튼 표시
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

    const saveButtonMessage: Message = {
      role: "system",
      content: "나열된 내용을 투두리스트에 추가하고 싶다면 '저장하기' 버튼을 눌러주세요",
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      message: [
        { ...userMessage },
        { ...aiMessage },
        showSaveButton ? { ...saveButtonMessage, showSaveButton } : null
      ].filter(Boolean)
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
