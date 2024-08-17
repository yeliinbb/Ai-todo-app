const diaryFetchAllData = async () => {
  try {
    const response = await fetch("/api/diaries");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const diaryDates = data?.map((diary: { created_at: string }) => ({
      ...diary,
      created_at: new Date(diary.created_at)
    }));
    return diaryDates;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch diary data");
  }
};

export default diaryFetchAllData;
