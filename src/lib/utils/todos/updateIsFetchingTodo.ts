import { DiaryEntry } from "@/types/diary.type";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { supabase } from "@/utils/supabase/client";

export const updateIsFetchingTodo = async (userId: string, selectedDate: string, diaryId: string) => {
  try {
    const searchDate = selectedDate ? new Date(selectedDate) : new Date();
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);
    const { data, error: selectError } = await supabase
      .from(DIARY_TABLE)
      .select("content")
      .eq("user_auth", userId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .single();

    if (selectError) {
      throw selectError;
    }

    if (!data || !Array.isArray(data.content)) {
      throw new Error("Diary content not found or is not an array.");
    }
    const contentArray: DiaryEntry[] = data.content as DiaryEntry[];

    const diaryIndex = contentArray.findIndex((entry) => entry.diary_id === diaryId);

    if (diaryIndex === -1) {
      throw new Error("Diary entry not found in the content array.");
    }

    const updatedContent = contentArray.map((entry: any, index: number) => {
      if (index === diaryIndex) {
        return {
          ...entry,
          isFetching_todo: true
        };
      }
      return entry;
    });
    const { error: updateError } = await supabase
      .from(DIARY_TABLE)
      .update({ content: updatedContent })
      .eq("user_auth", userId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Failed to update isFetching_todo", error);
    throw error;
  }
};
