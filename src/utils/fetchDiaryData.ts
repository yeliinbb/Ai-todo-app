import { DiaryEntry } from "@/types/diary.type";
import { createClient } from "./supabase/client";

const user_id = "kimyong1@result.com";
export const fetchDiaryData = async (date: string): Promise<DiaryEntry[]> => {
  const supabase = createClient();

  try {
    const searchDate = date ? new Date(date) : new Date();
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const { data: diaryData, error } = await supabase
      .from("diaries")
      .select("*")
      .eq("user_id", user_id)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error("데이터를 불러오는 데 실패했습니다.");
    }

    if (!diaryData || diaryData.length === 0) {
      throw new Error("해당 날짜의 다이어리가 없습니다.");
    }
    return diaryData.map((entry: any) => ({
      diary_id: entry.diary_id,
      created_at: entry.created_at,
      content: entry.content, // JSON 문자열을 객체로 변환
      user_id: entry.user_id || "" // user_id가 null일 경우 빈 문자열로 대체
    }));
  } catch (error) {
    console.error("Error fetching diary data:", error);
    throw error;
  }
};
