const todoPatterns = {
  start: /투두\s*리스트를?\s*(작성|만들고)/,
  add: /투두\s*리스트에?\s*(추가|넣어)/,
  list: /(해야\s*할\s*(일|것)|할\s*일).*있/
};

const isTodoStart = (message: string): boolean => todoPatterns.start.test(message);
const isTodoAdd = (message: string): boolean => todoPatterns.add.test(message);
const isTodoList = (message: string): boolean => todoPatterns.list.test(message);

const isTodoRequest = (message: string): boolean => isTodoStart(message) || isTodoAdd(message) || isTodoList(message);

export const getTodoRequestType = (message: string): "start" | "add" | "list" | "none" => {
  if (isTodoStart(message)) return "start";
  if (isTodoAdd(message)) return "add";
  if (isTodoList(message)) return "list";
  return "none";
};

const TODO_BULLET = "•";

export const formatTodoList = (items: string[]): string => {
  const formattedItems = items.map((item) => `${TODO_BULLET} ${item.trim()}`).join("\n");
  return formattedItems;
};
