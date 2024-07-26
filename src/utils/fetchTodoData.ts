import { TodoListType } from "@/types/diary.type";
import { createClient } from "./supabase/client";

const supabase = createClient();
export const fetchTodosData = async (userId: string, date: string) => {
  try {
    const searchDate = date ? new Date(date) : new Date();
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data as TodoListType[];
  } catch (err) {
    console.error("Error fetching todos data:", err);
    throw new Error("Failed to fetch todos data.");
  }
};
