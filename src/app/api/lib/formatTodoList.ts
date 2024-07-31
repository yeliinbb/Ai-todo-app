const TODO_BULLET = "•";

export const formatTodoList = (items: string[]): string => {
  const formattedItems = items.map((item) => `${TODO_BULLET} ${item.trim()}`).join("\n");
  return formattedItems;
};
