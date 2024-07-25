import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const toggleIsFetchingTodo = async (diaryId: string, currentState: boolean): Promise<void> => {
  try {
    const { error } = await supabase.from("diaries").update({ isFetching_todo: currentState }).eq("diary_id", diaryId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error toggling isFetching_todo:", error);
    throw new Error("Failed to toggle isFetching_todo.");
  }
};
