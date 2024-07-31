import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuid4 } from "uuid";

export const handleSaveChatDiary = async (supabase: SupabaseClient, sessionId: string) => {
  const { data: sessionData } = await supabase
    .from(CHAT_SESSIONS)
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  if (sessionData && sessionData.messages) {
    const lastMessage = sessionData.messages[sessionData.messages.length - 1];
    if (lastMessage && lastMessage.content) {
      const diaryItems = extractDiaryItems(lastMessage.content);
      if (diaryItems.length > 0) {
        await saveChatDiaryItems(supabase, sessionId, diaryItems);
        return { success: true, message: "일기가 저장되었습니다." };
      }
    }
  }
  return { success: false, error: "저장할 일기 항목이 없습니다." };
};

const saveChatDiaryItems = async (supabase: SupabaseClient, sessionId: string, items: string[]) => {
  const { data, error } = await supabase.from("DIARY_TABLE").insert(
    items.map((item) => ({
      //   session_id: sessionId,
      diary_id: uuid4(),
      created_at: new Date().toISOString(),
      content: item,
      todo_description: "설명을 추가해주세요",
      user_id: null,
      address: null,
      event_datetime: null,
      is_done: false,
      is_chat: true
    }))
  );
  if (error) {
    console.error("Error saying chat diary items", error);
    throw error;
  }
  return data;
};

export const extractDiaryItems = (content: string) => {
  return content
    .replace(/^.*일기리스트:?/i, "") // "일기리스트:" 부분 제거
    .replace(/[•*-]\s*/g, "") // 모든 글머리 기호 제거
    .split("\n")
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter((item) => item !== "" && !item.toLowerCase().includes("위 내용을"));
};
