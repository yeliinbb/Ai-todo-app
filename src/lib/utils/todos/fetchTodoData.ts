import { TodoListType } from "@/types/diary.type";
import { createClient } from "../../../utils/supabase/client";
import { QueryFunction } from "@tanstack/react-query";

// type FetchTodosDataType = {
//   queryKey: [string, string, string?];
// };

// const supabase = createClient();
// export const fetchTodoItems: QueryFunction<TodoListType[], [string, string, string?]> = async ({
//   queryKey
// }): Promise<TodoListType[]> => {
//   const [_, userId, date] = queryKey;
//   try {
//     const searchDate = date ? new Date(date) : new Date();
//     const startDate = new Date(searchDate);
//     startDate.setUTCHours(0, 0, 0, 0);
//     const endDate = new Date(searchDate);
//     endDate.setUTCHours(23, 59, 59, 999);
//     const { data, error } = await supabase
//       .from("todos")
//       .select("*")
//       .eq("user_id", userId)
//       .gte("created_at", startDate.toISOString())
//       .lt("created_at", endDate.toISOString())
//       .order("created_at", { ascending: true });

//     if (error) {
//       throw new Error(error.message);
//     }
//     console.log(data);
//     return data as TodoListType[];
//   } catch (err) {
//     if (err instanceof Error) {
//       throw new Error("fetchTodosData에서 에러 발생했습니다.", err);
//     }
//     throw new Error("fetchTodosData에서 예상치 못한 오류 발생했습니다.");
//   }
// };

export const fetchTodoItems = async ({ queryKey }: { queryKey: [string, string, string] }) => {
  try {
    const [_, userId, date] = queryKey;
    const response = await fetch(`/api/todolist/${userId}/${date}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Todo List 호출하는과정중 예상치 못한 오류 발생했습니다.");
  }
};
