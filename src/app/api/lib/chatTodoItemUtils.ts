import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
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
      const todoItems = extractTodoItemsToSave(lastMessage.content);
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
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting User Data", userError);
    throw userError;
  }

  const todoToInsert = items.map((item) => ({
    //   session_id: sessionId,
    todo_id: uuid4(),
    created_at: new Date().toISOString(),
    todo_title: item,
    todo_description: null,
    user_id: user.id,
    address: { lat: 0, lng: 0 },
    event_datetime: dayjs().set("hour", 0).set("minute", 0).toISOString(),
    is_done: false,
    is_chat: true,
    is_all_day_event: true
  }));

  const { data, error } = await supabase.from("todos").insert(todoToInsert);

  if (error) {
    console.error("Error saving chat todo items", error);
    throw error;
  }
  return data;
};

const extractTodoItemsToSave = (content: string) => {
  return content
    .replace(/^.*투두리스트:?/i, "") // "투두리스트:" 부분 제거
    .replace(/[•*-]\s*/g, "") // 모든 글머리 기호 제거
    .split("\n")
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter((item) => item !== "" && !item.toLowerCase().includes("위 내용을"));
};
