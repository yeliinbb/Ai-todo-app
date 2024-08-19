import {
  formatRecommendItems,
  formatTodoItems,
  getCombinedSystemMessage,
  getTodoRequestType,
  getTodoSystemMessage,
  handleGeneralResponse,
  handleRecommendResponse,
  handleSaveChatTodo,
  handleTodoResponse,
  handleUnknownResponse,
  handleAddResponse
} from "@/app/api/lib/chat";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { getFormattedKoreaTime, getFormattedKoreaTimeWithOffset } from "@/lib/utils/getFormattedLocalTime";
import { ApiResponse, ChatTodoItem, Message, MessageWithButton, RecommendItem } from "@/types/chat.session.type";
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
      // 웰컴 메시지 한 개인 경우
      const welcomeMessage: MessageWithButton = {
        role: "system",
        content: "안녕하세요, 저는 당신의 AI 비서 PAi입니다. 필요하신 게 있다면 저에게 말씀해주세요.",
        created_at: getFormattedKoreaTime(),
        showSaveButton: false
      };

      // 웰컴 메시지 여러 개인 경우
      const welcomeMessages: MessageWithButton[] = [
        {
          role: "system",
          content:
            "안녕하세요, 저는 당신의 AI 비서 PAi입니다. 투두리스트 작성 및 추천, 간단한 질문 답변 등 다양한 업무를 도와드릴 수 있습니다. 필요하신 게 있다면 저에게 말씀해주세요.",
          created_at: getFormattedKoreaTime(),
          showSaveButton: false
        },
        {
          role: "system",
          content: "투두리스트를 작성하려면 아래 '투두리스트 작성하기' 버튼을 눌러주세요.",
          created_at: getFormattedKoreaTimeWithOffset(), // 1ms 후의 시간으로 설정
          showSaveButton: false
        }
      ];

      // 웰컴 메시지를 데이터베이스에 저장
      await supabase
        .from(CHAT_SESSIONS)
        .update({ messages: welcomeMessages })
        .eq("session_id", sessionId)
        .eq("ai_type", "assistant");

      return NextResponse.json({
        message: [...welcomeMessages].filter(Boolean)
      });
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

  const { message, saveTodo, todoMode, currentTodoList } = await request.json();
  console.log("Received currentTodoList => ", currentTodoList);

  let showSaveButton: Boolean;
  let todoItems = currentTodoList || [];
  let aiMessage: Message = {
    role: "assistant",
    content: "",
    created_at: getFormattedKoreaTime()
  };

  // 저장 로직을 먼저 처리
  if (saveTodo) {
    try {
      const result = await handleSaveChatTodo(supabase, sessionId, todoItems);

      // 기존 메시지 가져오기
      const { data: sessionData, error: fetchError } = await supabase
        .from(CHAT_SESSIONS)
        .select("messages")
        .eq("session_id", sessionId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const existingMessages = (sessionData?.messages as Json[] | null) ?? [];
      const newMessage = result.message as Json;

      const updatedMessages: Json[] = [...existingMessages, newMessage];

      // 업데이트 된 매시지 저장
      const { error: updatedError } = await supabase
        .from(CHAT_SESSIONS)
        .update({
          messages: updatedMessages,
          updated_at: getFormattedKoreaTime()
        })
        .eq("session_id", sessionId)
        .eq("ai_type", "assistant");

      if (updatedError) {
        throw updatedError;
      }

      return NextResponse.json({
        message: updatedMessages,
        success: result.success,
        errorItems: result.errorItems
      });
    } catch (error) {
      console.error("Error saving todo list:", error);
      return NextResponse.json(
        {
          error: "투두 리스트 저장 중 오류가 발생했습니다.",
          errorDetails: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  }

  try {
    // 사용자 메시지 저장
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
    const userMessage: Message = { role: "user", content: message, created_at: getFormattedKoreaTime() };
    messages.push(userMessage);

    // systemMessage 설정
    let todoRequestType = getTodoRequestType(message, todoMode, currentTodoList);
    console.log("todoMode => ", todoMode);
    console.log("todoRequestType => ", todoRequestType);
    const todoSystemMessage = getTodoSystemMessage(todoRequestType, currentTodoList);
    const combinedSystemMessage = getCombinedSystemMessage(todoSystemMessage);
    // console.log("combinedSystemMessage => ", combinedSystemMessage);
    // Open API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: combinedSystemMessage
        },
        // 이전 메시지들을 포함하여 ai가 현재의 대화 흐름을 파악할 수 있도록 이해돕기
        ...messages.map(
          (m): ChatCompletionMessageParam => ({
            role: m.role as "system" | "user" | "assistant",
            content: typeof m.content === "string" ? m.content : JSON.stringify(m.content)
          })
        ),
        { role: "user", content: message }
      ] as ChatCompletionMessageParam[],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    // OpenAI API 호출 후 응답 처리
    try {
      if (!completion.choices || completion.choices.length === 0) {
        throw new Error("No choices in the API response");
      }

      const firstChoice = completion.choices[0];
      if (typeof firstChoice.message?.content !== "string") {
        throw new Error("Invalid message content in API response");
      }

      let aiResponse = firstChoice.message.content ?? "";
      console.log("OpenAI API Response", firstChoice.message);
      let responseJson: ApiResponse;

      try {
        responseJson = JSON.parse(aiResponse);
        console.log("responseJson => ", responseJson);
        console.log("Original AI Response type:", typeof responseJson);

        if (typeof responseJson !== "object" || responseJson === null) {
          throw new Error("Invalid response format from AI");
        }
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON", parseError);
        throw new Error("Failed to parse AI response");
      }

      let processedResponse: ApiResponse;
      console.log("responseJson.type", responseJson.type);
      switch (responseJson.type) {
        case "general":
          processedResponse = handleGeneralResponse(responseJson);
          break;
        case "recommend":
          processedResponse = handleRecommendResponse(responseJson);
          break;
        case "todo":
          processedResponse = handleTodoResponse(responseJson);
          break;
        case "add":
          processedResponse = handleAddResponse(responseJson, currentTodoList);
          break;
        default:
          processedResponse = handleUnknownResponse();
      }
      console.log("Processed Response:", processedResponse); // 처리된 응답 로깅

      if (processedResponse.type === "recommend") {
        const recommendItems: RecommendItem[] = processedResponse?.content?.recommend_list ?? [];
        console.log("recommendItems => ", recommendItems);
        todoItems = [...recommendItems];
        aiMessage.content = formatRecommendItems(todoItems);
      } else if (processedResponse.type === "todo") {
        const todoListItems: ChatTodoItem[] = processedResponse?.content?.todo_list ?? [];
        console.log("todoListItems => ", todoListItems);
        todoItems = [...todoListItems];
        const todoListResponse = formatTodoItems(todoItems);
        console.log("todoListResponse => ", todoListResponse);
        aiMessage.content = todoListResponse;
      } else if (processedResponse.type === "add") {
        const newItems: ChatTodoItem[] = processedResponse?.content?.added_items ?? [];
        console.log("New items to add => ", newItems);
        todoItems = [...currentTodoList, ...newItems];
        const todoListResponse = formatTodoItems(todoItems);
        console.log("Updated todo list => ", todoListResponse);
        aiMessage.content = todoListResponse;
      } else {
        const normalResponse = processedResponse.content.message || "";
        console.log("normalResponse => ", normalResponse);
        aiMessage.content = normalResponse;
        showSaveButton = false;
      }

      showSaveButton = todoItems.length > 0;
    } catch (error) {
      console.error("Failed to parse AI response as JSON => ", error);
      if (process.env.NODE_ENV === "development") {
        // 개발 환경에서는 상세한 오류 정보 반환
        return NextResponse.json(
          {
            error: "Error processing AI response",
            details: {
              message: (error as Error).message,
              stack: (error as Error).stack
            }
          },
          { status: 500 }
        );
      } else {
        // 프로덕션 환경에서는 일반적인 오류 메시지 설정
        aiMessage.content = "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.";
        showSaveButton = false;
      }
    }

    messages.push(aiMessage);

    // 업데이트 된 매시지 저장
    const { error: updatedError } = await supabase
      .from(CHAT_SESSIONS)
      .update({
        messages: messages,
        updated_at: getFormattedKoreaTime()
      })
      .eq("session_id", sessionId)
      .eq("ai_type", "assistant");

    if (updatedError) {
      console.error("Error updating session", updatedError);
      return NextResponse.json({ error: "Failed to updated session" }, { status: 500 });
    }

    const saveButtonMessage: Message = {
      role: "assistant",
      content:
        "나열된 내용을 투두리스트에 추가하고 싶다면 '저장하기' 버튼을, 모두 삭제하고 싶다면 '초기화 하기' 버튼을 눌러주세요",
      created_at: getFormattedKoreaTime()
    };

    const hasNewTodoItems =
      todoItems.length > 0 && todoItems.some((item: ChatTodoItem) => !currentTodoList.includes(item));

    console.log("todoItems 2 => ", todoItems);

    return NextResponse.json({
      message: [
        { ...userMessage },
        { ...aiMessage },
        showSaveButton ? { ...saveButtonMessage, showSaveButton } : null
      ].filter(Boolean),
      newTodoItems: hasNewTodoItems ? todoItems : [],
      currentTodoList: todoItems
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
