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
