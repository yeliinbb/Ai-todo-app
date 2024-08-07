import { DiaryEntry } from "@/types/diary.type";
import { createClient } from "../../../utils/supabase/client";

export const fetchDiaryDetailData = async (diaryId: string): Promise<DiaryEntry> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from("diaries").select("*").eq("diary_id", diaryId).single(); // 단일 항목만 필요하므로 .single() 사용

    if (error) {
      console.error("Error fetching diary detail:", error);
      throw new Error("Failed to fetch diary detail");
    }

    // 데이터 타입 확인 및 반환
    if (!data) {
      throw new Error("No data found");
    }

    console.log("Fetched diary detail:", data);
    return data as DiaryEntry; // 타입 캐스팅, 필요시 데이터 검증 추가
  } catch (error) {
    console.error("Error fetching diary detail:", error);
    throw new Error("Failed to fetch diary detail");
  }
};
