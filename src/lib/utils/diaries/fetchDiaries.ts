import { DiaryEntry } from "@/types/diary.type";

const fetchDiaries = async ({ queryKey }: { queryKey: [string, string, string] }) => {
  const [_, userId, date] = queryKey;
  try {
    const response = await fetch(`/api/diaries/${userId}/${date}`);

    if (!response.ok) {
      throw new Error("Failed to fetch diary data");
    }
    const data = await response.json();
    return data as DiaryEntry
  } catch (error) {
    console.error("Error in fetchDiaryData:", error);
    throw error;
  }
};

export default fetchDiaries;
