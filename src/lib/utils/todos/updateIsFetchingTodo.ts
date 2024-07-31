import { DiaryEntry } from "@/types/diary.type";
import { supabase } from "../../../utils/supabase/client";

export const updateIsFetchingTodo = async (userId: string, selectedDate: string, diaryId: string) => {
  try {
    // Convert selectedDate to the start and end of the day
    const searchDate = selectedDate ? new Date(selectedDate) : new Date();
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);

    // Select the content column for the specific diary
    const { data, error: selectError } = await supabase
      .from("diaries")
      .select("content")
      .eq("user_id", userId)
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
    console.log(updatedContent);
    const { error: updateError } = await supabase
      .from("diaries")
      .update({ content: updatedContent })
      .eq("user_id", userId)
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
