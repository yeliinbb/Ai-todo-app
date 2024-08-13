import { handleSaveChatTodo } from "@/app/api/lib/chatTodoItemUtils";
import {
  extractTodoItemsFromResponse,
  formatTodoList,
  getTodoRequestType,
  getTodoSystemMessage
} from "@/app/api/lib/todoPatterns";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import openai from "@/lib/utils/chat/openaiClient";
import { Message, MessageWithButton } from "@/types/chat.session.type";
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
        role: "assistant",
        content: "안녕하세요, 저는 당신의 AI 비서 PAi입니다. 필요하신 게 있다면 저에게 말씀해주세요.",
        created_at: new Date().toISOString(),
        showSaveButton: false
      };

      // 웰컴 메시지 여러 개인 경우
      const welcomeMessages: MessageWithButton[] = [
        {
          role: "assistant",
          content:
            "안녕하세요, 저는 당신의 AI 비서 PAi입니다. 투두리스트 작성 및 추천, 간단한 질문 답변 등 다양한 업무를 도와드릴 수 있습니다. 필요하신 게 있다면 저에게 말씀해주세요.",
          created_at: new Date().toISOString(),
          showSaveButton: false
        },
        {
          role: "assistant",
          content: "투두리스트를 작성하려면 아래 '투두리스트 작성하기' 버튼을 눌러주세요.",
          created_at: new Date(Date.now() + 1).toISOString(), // 1ms 후의 시간으로 설정
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

type TodoItem = {
  title?: string;
  description?: string;
  time?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
};

type RecommendItem = {
  title?: string;
  description?: string;
};

type ApiResponse = {
  type: "todo" | "recommend" | "general";
  content: {
    todo_list?: TodoItem[];
    recommend_list?: RecommendItem[];
    message?: string;
  };
};

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id: sessionId } = params;

  const { message, saveTodo, todoMode, currentTodoList } = await request.json();

  let showSaveButton = false;
  let todoItems: string[] = [];
  let updatedTodoList = [...currentTodoList];

  // 투두리스트 저장하는 로직
  if (saveTodo) {
    try {
      const result = await handleSaveChatTodo(supabase, sessionId);
      if (result.success) {
        todoItems = [];
        updatedTodoList = [];
        console.log("todoItems saveTodo => ", todoItems);
        return NextResponse.json({ message: result.message });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "An error occurred while saving todo list." }, { status: 500 });
    }
  }

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
    let todoRequestType = getTodoRequestType(message, todoMode, currentTodoList);
    console.log("todoMode => ", todoMode);
    console.log("todoRequestType => ", todoRequestType);
    const todoSystemMessage = getTodoSystemMessage(todoRequestType, currentTodoList);
    //     const combinedSystemMessage = `${todoSystemMessage}

    // 너는 사용자가 투두리스트를 작성하고, 상세한 투두리스트를 추천하는데 도움을 주는 ai야. ${todoSystemMessage}의 내용에 기반해서 사용자에게 적절한 답변을 하면 되.
    // 1. 사용자가 새로운 투두리스트를 작성하거나 추천 받고 싶어할 때는 "general" 타입을,
    // 2. 시용자가 투두리스트를 입력하면 "todo"타입을,
    // 3. 사용자에게 추천 투두리스트틀 제안할 때는 "recommend" 타입에 맞게 대답해
    // 모든 응답은 JSON 형식으로 반환해야 하며, 다음 구조를 따라야 해:
    // {
    //   "type": "todo" 또는 "recommend" 또는 "general",
    //   "content": {
    //     // type이 "todo"일 경우
    //     "todo_list": [
    //       {
    //         "title": "할 일 제목",
    //         "description": "상세 설명",
    //         "time": "시간",
    //         "location": "장소",
    //         "longitude": 경도,
    //         "latitude": 위도
    //       },
    //       // ... 추가 todo 항목들
    //     ]
    //     // type이 recommend일 경우
    //     "recommend_list" : [
    //       {
    //         "title": "추천 항목 제목",
    //         "description": "추천 이유 또는 상세 설명"
    //       },
    //       // ... 추가 추천 항목들
    //     ]
    //     // type이 "general"일 경우
    //     "message": "일반적인 대화 내용"
    //   }
    // }
    // 사용자가 투두를 추가, 삭제, 수정할 경우 type은 "todo"로,
    // 사용자가 추천을 원할 경우 type은 "recommend"로,
    // 그 외의 일반적인 이야기를 할 때는 type을 "general"로 설정해.
    // 각 type에 맞는 content 구조를 반드시 따라야 해.`;

    const fewShotExamples = `
예시 1:
User: 투두리스트를 작성하고 싶어
AI: {"type": "general", "content": {"message": "네, 새로운 투두리스트를 작성하겠습니다. 어떤 항목들을 추가하고 싶으신가요? 쉼표로 구분하여 항목들을 나열해주세요. 가능하다면 시간과 장소도 함께 말씀해 주세요."}}

예시 2:
User: 오후 3시에 시청 앞 광장에서 친구 만나기, 저녁 7시 집에서 요가하기
AI: {"type": "todo", "content": {"todo_list": [
  {"title": "친구 만나기", "description": "시청 앞 광장에서 친구와 약속", "time": "오후 3시", "location": "시청 앞 광장", "longitude": 126.9780, "latitude": 37.5665},
  {"title": "요가하기", "description": "집에서 요가 운동하기", "time": "저녁 7시", "location": "집", "longitude": 0, "latitude": 0}
]}}

예시 3:
User: 투두리스트 추천받고 싶어
AI: {"type": "general", "content": {"message": "어떤 상황이나 목적의 투두리스트를 추천해드릴까요? 예를 들어, '주말 투두리스트', '업무 효율성 향상을 위한 투두리스트' 등과 같이 구체적인 상황을 알려주시면 더 적절한 추천이 가능합니다."}}

예시 4:
User: 서울에서의 주말 투두리스트 추천해줘
AI: {"type": "recommend", "content": {"recommend_list": [
  {"title": "남산 타워 방문하기", "description": "서울의 상징적인 랜드마크인 남산 타워를 방문하여 도시 전경을 감상합니다.", "location": "남산 타워", "longitude": 126.9883, "latitude": 37.5511},
  {"title": "경복궁 둘러보기", "description": "한국의 역사와 문화를 체험할 수 있는 경복궁을 관람합니다.", "location": "경복궁", "longitude": 126.9770, "latitude": 37.5796},
  {"title": "한강공원에서 피크닉 즐기기", "description": "한강공원에서 여유로운 시간을 보내며 피크닉을 즐깁니다.", "location": "여의도 한강공원", "longitude": 126.9345, "latitude": 37.5285},
  {"title": "인사동 거리 탐방하기", "description": "전통 문화의 중심지인 인사동에서 한국 전통 상품들을 구경하고 쇼핑을 즐깁니다.", "location": "인사동", "longitude": 126.9850, "latitude": 37.5739},
  {"title": "북촌 한옥마을 산책하기", "description": "전통 한옥이 보존된 북촌 한옥마을을 거닐며 한국의 전통 건축을 감상합니다.", "location": "북촌 한옥마을", "longitude": 126.9850, "latitude": 37.5824}
]}}

예시 5:
User: 내일 할 일 정리해줘. 아침 7시 기상, 8시 회의, 점심에 동료와 식사, 오후 3시 프레젠테이션, 저녁 7시 운동
AI: {"type": "todo", "content": {"todo_list": [{"title": "기상하기", "description": "하루를 시작합니다.", "time": "오전 7시", "location": "집", "longitude": 0, "latitude": 0}, {"title": "회의 참석하기", "description": "오전 회의에 참석합니다.", "time": "오전 8시", "location": "회의실", "longitude": 0, "latitude": 0}, {"title": "동료와 점심 식사하기", "description": "동료와 함께 점심을 먹으며 대화를 나눕니다.", "time": "오후 12시", "location": "회사 근처 식당", "longitude": 0, "latitude": 0}, {"title": "프레젠테이션하기", "description": "준비한 프레젠테이션을 발표합니다.", "time": "오후 3시", "location": "회의실", "longitude": 0, "latitude": 0}, {"title": "운동하기", "description": "일과 후 건강을 위해 운동합니다.", "time": "오후 7시", "location": "체육관", "longitude": 0, "latitude": 0}]}}
`;

    const combinedSystemMessage = `${todoSystemMessage}\n${fewShotExamples}\n

당신은 사용자가 투두리스트를 작성하고, 상세한 투두리스트를 추천하는데 도움을 주는 AI 어시스턴트입니다. 다음 지침을 엄격히 따라주세요:

1. 사용자가 "투두리스트를 작성하고 싶어" 또는 유사한 요청을 하면:
   - type을 "general"로 설정
   - content.message에 "네, 새로운 투두리스트를 작성하겠습니다. 어떤 항목들을 추가하고 싶으신가요? 쉼표로 구분하여 항목들을 나열해주세요. 가능하다면 시간과 장소도 함께 말씀해 주세요."라고 답변

2. 사용자가 실제 투두리스트 항목들을 나열하면:
   - type을 "todo"로 설정
   - content.todo_list에 사용자가 제시한 항목들을 파싱하여 추가
   - 각 항목은 다음 형식을 정확히 따라야 합니다:
     {
       "title": "할 일 제목 (필수)",
       "description": "상세 설명 (가능한 한 구체적으로)",
       "time": "시간 (알 수 있는 경우)",
       "location": "장소 (알 수 있는 경우)",
       "longitude": 0, // 실제 위치를 대략적으로 추정. 모르는 경우 0
       "latitude": 0   // 실제 위치를 대략적으로 추정. 모르는 경우 0
     }
   - 사용자가 제공하지 않은 정보는 빈 문자열("")로 설정하되, 최대한 추론하여 채워넣으세요.
   - 장소가 언급된 경우, 해당 장소의 대략적인 위도와 경도를 제공하세요. 정확한 값을 모르는 경우 대략적인 값이라도 제시하세요.

3. 사용자가 "투두리스트 추천받고 싶어" 또는 유사한 요청을 하면:
   - type을 "general"로 설정
   - content.message에 "어떤 상황이나 목적의 투두리스트를 추천해드릴까요? 예를 들어, '주말 투두리스트', '업무 효율성 향상을 위한 투두리스트' 등과 같이 구체적인 상황을 알려주시면 더 적절한 추천이 가능합니다."라고 답변

4. 사용자가 구체적인 상황이나 목적을 언급하며 투두리스트 추천을 요청하면:
   - type을 "recommend"로 설정
   - content.recommend_list에 해당 상황이나 목적에 맞는 5-7개의 투두리스트 항목을 추가
   - 각 항목은 다음 형식을 정확히 따라야 합니다:
     {
       "title": "추천 항목 제목 (간결하고 명확하게, '~하기'로 끝나도록)",
       "description": "추천 이유 또는 상세 설명 (구체적으로)",
       "location": "장소 (가능한 경우)",
       "longitude": 0, // 실제 위치를 대략적으로 추정. 모르는 경우 0
       "latitude": 0   // 실제 위치를 대략적으로 추정. 모르는 경우 0
     }

5. 그 외의 경우:
   - type을 "general"로 설정
   - content.message에 적절한 응답을 작성

주의사항:
- 항상 주어진 JSON 형식을 정확히 따라야 합니다.
- 모든 응답은 유효한 JSON 형식이어야 합니다.
- 사용자의 요청을 최대한 반영하여 상세하고 유용한 정보를 제공하세요.
- 시간, 장소 등의 정보가 명확하지 않은 경우, 합리적으로 추정하여 채워넣되 너무 구체적이지 않게 작성하세요.
- 위도와 경도 정보는 실제 값을 알 수 없으므로, 대략적인 위치를 나타내는 예시 값을 제공하세요. 특정 도시나 지역이 언급된 경우, 그 지역의 대표적인 좌표를 사용하세요.

위의 지침과 예시를 참고하여 사용자의 요청에 적절히 응답해주세요.`;

    // console.log("combinedSystemMessage => ", combinedSystemMessage);

    // Open API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
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
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    let aiMessage: Message = {
      role: "assistant",
      content: "",
      created_at: new Date().toISOString()
    };

    try {
      let aiResponse = completion.choices[0].message.content ?? "";
      console.log("OpenAI API Response", completion.choices[0].message);

      const responseJson: ApiResponse = JSON.parse(aiResponse);
      console.log("responseJson => ", responseJson);

      let processedResponse;

      try {
        const parsedResponse = JSON.parse(aiResponse);
        console.log("Original AI Response:", parsedResponse); // 디버깅을 위해 원본 응답 로깅

        if (parsedResponse.type === "general") {
          // 일반적인 응답 처리
          if (parsedResponse.content && typeof parsedResponse.content.message === "string") {
            // AI의 응답이 유효한 경우 그대로 사용
            processedResponse = parsedResponse;
          } else {
            // AI의 응답이 예상 형식이 아닌 경우 기본 응답 사용
            processedResponse = {
              type: "general",
              content: {
                message: "죄송합니다. 귀하의 요청을 정확히 이해하지 못했습니다. 조금 더 자세히 설명해 주시겠어요?"
              }
            };
          }
        } else if (parsedResponse.type === "recommend") {
          // 추천 리스트 처리
          if (
            parsedResponse.content &&
            Array.isArray(parsedResponse.content.recommend_list) &&
            parsedResponse.content.recommend_list.length > 0
          ) {
            // 유효한 추천 리스트인 경우 그대로 사용
            processedResponse = parsedResponse;
          } else {
            // 추천 리스트가 비어있거나 유효하지 않은 경우
            processedResponse = {
              type: "general",
              content: {
                message: "추천 목록을 생성하는 데 어려움이 있었습니다. 좀 더 구체적인 정보나 다른 요청을 해주시겠어요?"
              }
            };
          }
        } else if (parsedResponse.type === "todo") {
          // 투두 리스트 처리
          if (
            parsedResponse.content &&
            Array.isArray(parsedResponse.content.todo_list) &&
            parsedResponse.content.todo_list.length > 0
          ) {
            // 유효한 투두 리스트인 경우 그대로 사용
            processedResponse = parsedResponse;
          } else {
            // 투두 리스트가 비어있거나 유효하지 않은 경우
            processedResponse = {
              type: "general",
              content: {
                message: "투두 리스트를 생성하는 데 어려움이 있었습니다. 다시 한 번 항목들을 말씀해 주시겠어요?"
              }
            };
          }
        } else {
          // 알 수 없는 타입의 응답인 경우
          processedResponse = {
            type: "general",
            content: {
              message: "죄송합니다. 귀하의 요청을 처리하는 데 문제가 있었습니다. 다른 방식으로 말씀해 주시겠어요?"
            }
          };
        }

        console.log("Processed Response:", processedResponse); // 처리된 응답 로깅
      } catch (error) {
        console.error("Failed to parse AI response as JSON", error);
        processedResponse = {
          type: "general",
          content: {
            message: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요."
          }
        };
      }

      // aiResponse = aiResponse ? aiResponse.replace(/^[•*]\s*|\d+\.\s*/gm, "").trim() : "";
      // console.log("=========================");
      // console.log("aiResponse => ", aiResponse);

      const todoListItems: TodoItem[] = processedResponse?.content?.todo_list ?? [];
      console.log("todoListItems => ", todoListItems);

      const todoListResponse = todoListItems?.map((item) => {
        let formattedItem = `• ${item.title}`;

        if (item.time) formattedItem += ` ${item.time}`;
        if (item.location) formattedItem += ` ${item.location}`;
        if (item.description) formattedItem += ` : ${item.description}`;

        return formattedItem.trim();
      });

      const normalResponse = processedResponse?.content?.message ?? "";
      console.log("normalResponse => ", normalResponse);

      const recommendItems: RecommendItem[] = processedResponse?.content?.recommend_list ?? [];
      console.log("recommendItems => ", recommendItems);

      const recommendResponse = recommendItems?.map((item) => `• ${item.title} : ${item.description} `);

      if (processedResponse.type === "recommend") {
        aiMessage.content = recommendResponse.join("\n");
        showSaveButton = recommendItems.length > 0;
      } else if (processedResponse.type === "todo") {
        aiMessage.content = todoListResponse.join("\n");
        showSaveButton = todoListItems.length > 0;
      } else {
        aiMessage.content = normalResponse;
        showSaveButton = false;
      }
    } catch (error) {
      console.error("Failed to parse AI response as JSON => ", error);
      aiMessage.content = "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.";
      showSaveButton = false;
    }
    messages.push(aiMessage);

    // ai한테 새로 보내는 투두에 대한 응답
    // todoItems = extractTodoItemsFromResponse(aiResponse, todoRequestType, currentTodoList);
    // console.log("=========================");
    // console.log("todoItems 1 => ", todoItems);
    // console.log("currentTodoList => ", currentTodoList);

    // // todoRequestType에 따른 todoList 응답 받기
    // if (todoMode === "createTodo") {
    //   if (todoRequestType === "create") {
    //     console.log("create => ", todoRequestType);
    //     updatedTodoList = [...new Set([...updatedTodoList, ...todoItems])];
    //     showSaveButton = todoItems.length > 0; // 항목이 추가된 경우에만 save 버튼 표시
    //   } else if (todoRequestType === "add") {
    //     console.log("add => ", todoRequestType);
    //     updatedTodoList = [...new Set([...updatedTodoList, ...todoItems])];
    //     showSaveButton = todoItems.length > 0;
    //   } else if (todoRequestType === "delete") {
    //     console.log("delete");
    //     if (todoItems.length > 0) {
    //       updatedTodoList = todoItems;
    //     } else {
    //       console.log("No items to delete found");
    //     }
    //     console.log("delete updatedTodoList => ", updatedTodoList);
    //     showSaveButton = todoItems.length > 0;
    //   } else if (todoRequestType === "update") {
    //     console.log("update");
    //     showSaveButton = todoItems.length > 0;
    //   } else if (todoRequestType === "recommend") {
    //     console.log("recommend");
    //     console.log("recommendTodo", todoItems);
    //     updatedTodoList = todoItems;
    //     showSaveButton = todoItems.length > 0;
    //   }
    // } else if (todoMode === "resetTodo") {
    //   console.log("reset");
    //   todoItems = [];
    //   updatedTodoList = [];
    //   showSaveButton = false;
    // } else {
    //   console.log("Unknown todoMode");
    // }

    // console.log("=========================");
    // console.log("Final updatedTodoList", updatedTodoList);

    // 모든 케이스에 대해 formatTodoList 적용
    // let todoListResponse = "";
    // const formattedResponse = `${formatTodoList(todoItems ?? [])}`;
    // console.log("=========================");
    // console.log("formattedResponse => ", formattedResponse);

    // let aiMessage: Message = {
    //   role: "assistant",
    //   content: "",
    //   created_at: new Date().toISOString()
    // };

    // if (todoRequestType === "recommend") {
    //   aiMessage.content = recommendResponse;
    //   showSaveButton = recommendItems.length > 0;
    // } else {
    //   aiMessage.content = todoListItems.length > 0 ? (formattingResponse ?? "") : normalResponse;
    // }
    // messages.push(aiMessage);

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
      role: "assistant",
      content:
        "나열된 내용을 투두리스트에 추가하고 싶다면 '저장하기' 버튼을, 모두 삭제하고 싶다면 '초기화 하기' 버튼을 눌러주세요",
      created_at: new Date().toISOString()
    };

    const hasNewTodoItems = todoItems.length > 0 && todoItems.some((item: string) => !currentTodoList.includes(item));

    console.log("todoItems 2 => ", todoItems);

    return NextResponse.json({
      message: [
        { ...userMessage },
        { ...aiMessage },
        showSaveButton ? { ...saveButtonMessage, showSaveButton } : null
      ].filter(Boolean),
      newTodoItems: hasNewTodoItems ? todoItems : [],
      currentTodoList: todoItems
      // currentTodoList: todoItems,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
