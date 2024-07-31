// import { DiaryEntry } from "@/types/diary.type";
// import { createClient } from "./supabase/client";
// import { QueryFunction } from "@tanstack/react-query";

import { DiaryEntry } from "@/types/diary.type";

// const user_id = "kimyong1@result.com";
// export const fetchDiaryData: QueryFunction<DiaryEntry[], [string, string]> = async ({
//   queryKey
// }): Promise<DiaryEntry[]> => {
//   const supabase = createClient();
//   const [_, date] = queryKey;
//   try {
//     const searchDate = date ? new Date(date) : new Date();
//     const startDate = new Date(searchDate);
//     startDate.setUTCHours(0, 0, 0, 0);
//     const endDate = new Date(searchDate);
//     endDate.setUTCHours(23, 59, 59, 999);

//     const { data: diaryData, error } = await supabase
//       .from("diaries")
//       .select("*")
//       .eq("user_id", user_id)
//       .gte("created_at", startDate.toISOString())
//       .lt("created_at", endDate.toISOString())
//       .order("created_at", { ascending: true });

//     if (error) {
//       throw new Error("데이터를 불러오는 데 실패했습니다.");
//     }

//     return (diaryData || []).map((entry) => ({
//       diary_id: entry.diary_id,
//       created_at: entry.created_at,
//       content: entry.content,
//       user_id: entry.user_id || ""
//     })) as DiaryEntry[];
//   } catch (error) {
//     console.error("Error fetching diary data:", error);
//     throw error;
//   }
// };

const fetchDiaryData = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [_, date] = queryKey;
  try {
    const response = await fetch(`/api/diaries/${date}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diary data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchDiaryData:", error);
    throw error;
  }
};

export default fetchDiaryData;
