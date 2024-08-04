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
      const diaryItems = extractDiaryItemsToSave(lastMessage.content);
      if (diaryItems.length > 0) {
        await saveChatDiaryItems(supabase, sessionId, diaryItems);
        return {
          success: true,
          message:
            "일가 저장되었습니다. 새로운 일기를 작성하고 싶다면 일기 작성하기 버튼을, 아니라면 새로운 대화를 이어나가보세요!"
        };
      }
    }
  }
  return { success: false, error: "저장할 일기 내용이 없습니다." };
};

const saveChatDiaryItems = async (supabase: SupabaseClient, sessionId: string, items: string[]) => {
  const { data, error } = await supabase.from("diaries").insert(
    items.map((item) => ({
      diary_id: uuid4(),
      created_at: new Date().toISOString(),
      content: item,
      user_id: null, // 필요한 경우 사용자 ID를 추가하세요
      session_id: sessionId
    }))
  );
  if (error) {
    console.error("Error saving chat diary items", error);
    throw error;
  }
  return data;
};

export const extractDiaryItemsToSave = (content: string) => {
  return content
    .replace(/^.*일기리스트:?/i, "") // "일기리스트:" 부분 제거
    .replace(/[•*-]\s*/g, "") // 모든 글머리 기호 제거
    .split("\n")
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter((item) => item !== "" && !item.toLowerCase().includes("위 내용을"));
};
