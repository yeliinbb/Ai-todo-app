import { CHAT_SESSIONS } from "@/lib/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
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
        return { success: true, message: "투두리스트가 저장되었습니다." };
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

export const extractTodoItems = (content: string) => {
  return content
    .replace(/^.*투두리스트:?/i, "") // "투두리스트:" 부분 제거
    .replace(/[•*-]\s*/g, "") // 모든 글머리 기호 제거
    .split("\n")
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter((item) => item !== "" && !item.toLowerCase().includes("위 내용을"));
};
