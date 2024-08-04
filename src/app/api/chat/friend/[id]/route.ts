import { handleSaveChatDiary } from "@/app/api/lib/chatDiaryItemUtils";
import { Json } from "@/types/supabase";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { Message, MessageWithSaveButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  extractDiaryItemsFromResponse,
  formatDiaryList,
  getDiaryRequestType,
  getDiarySystemMessage
} from "@/app/api/lib/diaryPatterns";
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
      const welcomeMessages: MessageWithSaveButton[] = [
        {
          role: "friend",
          content: "안녕, 나는 너의 AI 친구 FAi야. 필요한게 있다면 뭐든 얘기해줘!",
          created_at: new Date().toISOString(),
          showSaveButton: false
        },
        {
          role: "friend",
          content: "일기 작성, 오늘 하루에 대한 이야기를 나눌수있어.",
          created_at: new Date(Date.now() + 1).toISOString(),
          showSaveButton: false
        },
        {
          role: "friend",
          content: "일기를 작성하려면 아래 '일기 작성하기' 버튼을 눌러줘.",
          created_at: new Date(Date.now() + 2).toISOString(),
          showSaveButton: false
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

  const { message, saveDiary, isDiaryMode, currentDiaryList } = await request.json();

  if (saveDiary) {
    try {
      const result = await handleSaveChatDiary(supabase, sessionId);
      if (result.success) {
        return NextResponse.json({ message: result.message });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "An error occurred while saving todo list." }, { status: 500 });
    }
  }

  const diaryRequestType = getDiaryRequestType(message, isDiaryMode, currentDiaryList);
  let showSaveButton = false;
  let systemMessage: string;
  let askForListChoice = false;

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
    if (isDiaryMode || diaryRequestType !== "none") {
      systemMessage = getDiarySystemMessage(diaryRequestType, currentDiaryList);
      console.log(systemMessage);
    } else {
      systemMessage = "일반적인 대화를 계속해주세요.";
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

    let aiResponse = completion.choices[0].message.content;
    console.log("OpenAI API Response", completion.choices[0].message);
    aiResponse = aiResponse ? aiResponse.replace(/^[•*]\s+/gm, "").trim() : "";
    // console.log("aiResponse", aiResponse);

    let diaryItems: string[] = [];
    let updatedDiaryList = [...currentDiaryList];

    console.log("isDiaryMode => ", isDiaryMode);
    console.log("diaryRequestType => ", diaryRequestType);

    // showSaveButton 결정 및 투두 항목 정리
    if (isDiaryMode || diaryRequestType !== "none") {
      diaryItems = extractDiaryItemsFromResponse(aiResponse ?? "");
      console.log("diaryItems => ", diaryItems);
      console.log("currentDiaryList => ", currentDiaryList);

      // create할 경우 새로운 투두를 추가하는것이기 때문에 기존 diaryItems 비우기
      if (diaryRequestType === "reset") {
        // console.log("reset");
        updatedDiaryList = [];
      } else if (diaryRequestType === "add") {
        // console.log("add");
        updatedDiaryList = [...new Set([...updatedDiaryList, ...diaryItems])];
        showSaveButton = true; // 항목이 추가된 경우에만 save 버튼 표시
      } else if (diaryRequestType === "list") {
        updatedDiaryList = [...diaryItems];
        showSaveButton = true;
      } else if (diaryRequestType === "delete") {
        updatedDiaryList = updatedDiaryList.filter((item) => !diaryItems.includes(item));
        showSaveButton = true;
      } else {
        // 새 리스트 생성 또는 대체
        updatedDiaryList = [...diaryItems];
        showSaveButton = diaryItems.length > 0;
      }
    }
    // 모든 케이스에 대해 formatDiaryList 적용
    aiResponse = `${formatDiaryList(updatedDiaryList ?? [])}`;

    // 기존 리스트가 있고, 새로운 항목이 추가되었을 때
    if (currentDiaryList.length > 0 && diaryItems.some((item) => !currentDiaryList.includes(item))) {
      askForListChoice = true;
    } else {
      showSaveButton = false;
    }

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

    const saveButtonMessage: Message = {
      role: "friend",
      content: "작성된 일기 내용을 일기에 추가하고 싶다면 '저장하기' 버튼을 눌러주세요",
      created_at: new Date().toISOString()
    };

    const choiceMessage: Message = {
      role: "system",
      content: "새로운 일기내용을 오늘 일기에 추가하시겠습니까, 아니면 새로운 일기로 대체하시겠습니까?",
      created_at: new Date().toISOString()
    };

    const diaryListCompleted = aiResponse?.includes("일기 작성이 완료되었습니다.");
    const hasNewDiaryItems =
      diaryItems.length > 0 && diaryItems.some((item: string) => !currentDiaryList.includes(item));

    // console.log("showSaveButton", showSaveButton);
    // console.log("askForListChoice", askForListChoice);
    console.log("updatedDiaryList => ", updatedDiaryList);

    return NextResponse.json({
      message: [
        { ...userMessage },
        { ...aiMessage },
        // askForListChoice ? choiceMessage : null,
        showSaveButton ? { ...saveButtonMessage, showSaveButton } : null
      ].filter(Boolean),
      diaryListCompleted,
      newDiaryItems: hasNewDiaryItems ? diaryItems : [],
      currentDiaryList: updatedDiaryList,
      askForListChoice
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
