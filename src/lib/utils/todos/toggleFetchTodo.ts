import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { DiaryEntry } from "@/types/diary.type";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const toggleIsFetchingTodo = async (
  diaryRowId: string,
  diaryId: string,
  currentState: boolean
): Promise<void> => {
  try {
    const { data, error } = await supabase.from(DIARY_TABLE).select("content").eq("diary_id", diaryRowId).single();

    if (error) {
      throw new Error(error.message);
    }
    let content = Array.isArray(data?.content) ? (data.content as DiaryEntry[]) : [];

    content = content.map((diary) => {
      if (diary && diary.diary_id === diaryId) {
        return {
          ...diary,
          isFetching_todo: currentState
        };
      }
      return diary;
    });
    const { error: updateError } = await supabase.from(DIARY_TABLE).update({ content }).eq("diary_id", diaryRowId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } catch (error) {
    console.error("Error toggling isFetching_todo:", error);
    throw new Error("Failed to toggle isFetching_todo.");
  }
};
