import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuid4 } from "uuid";

export const handleSaveChatTodo = async (supabase: SupabaseClient, sessionId: string) => {
  const { data: sessionData } = await supabase
    .from(CHAT_SESSIONS)
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  if (sessionData && sessionData.messages) {
    const lastMessage = sessionData.messages[sessionData.messages.length - 1];
    if (lastMessage && lastMessage.content) {
      const todoItems = extractTodoItems(lastMessage.content);
      if (todoItems.length > 0) {
        await saveChatTodoItems(supabase, sessionId, todoItems);
        return {
          success: true,
          message:
            "투두리스트가 저장되었습니다. 새로운 투두리스트를 작성하고 싶다면 투두리스트 작성하기 버튼을, 아니라면 새로운 대화를 이어나가보세요!"
        };
      }
    }
  }
  return { success: false, error: "저장할 투두리스트 항목이 없습니다." };
};

const saveChatTodoItems = async (supabase: SupabaseClient, sessionId: string, items: string[]) => {
  const { data, error } = await supabase.from("todo_chat_items").insert(
    items.map((item) => ({
      //   session_id: sessionId,
      todo_id: uuid4(),
      created_at: new Date().toISOString(),
      todo_title: item,
      todo_description: "설명을 추가해주세요",
      user_id: null,
      address: null,
      event_datetime: null,
      is_done: false,
      is_chat: true
    }))
  );
  if (error) {
    console.error("Error saying chat todo items", error);
    throw error;
  }
  return data;
};

// 숫자 제거 필요
export const extractTodoItems = (content: string) => {
  // console.log("content", content);
  return (
    content
      .split("\n")
      // 각 항목 앞의 기호를 제거
      .map((item) => item.replace(/^([•*-]\s*)?\d*\.\s*/, "").trim())
      .filter(
        (item) =>
          item !== "" &&
          ![
            "투두리스트",
            "초기화",
            "작성해주세요",
            "무엇을 추가하고 싶으신가요",
            "여러가지 일들을 추가해주시고 싶은데요"
          ].some((keyword) => item.toLowerCase().includes(keyword))
      )
  );
};
