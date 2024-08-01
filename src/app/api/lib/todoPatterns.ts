const todoPatterns = {
  reset: /투두\s*리스트를?\s*(초기화|리셋|새로\s*작성)/,
  create: /투두리스트를?\s*작성하고\s*싶어/,
  start: /투두\s*리스트를?\s*(작성|만들고)/,
  add: /투두\s*리스트에?\s*(추가|넣어)/,
  list: /(해야\s*할\s*(일|것)|할\s*일).*있|투두\s*리스트\s*(보여줘|알려줘)/,
  update: /(수정|변경|바꾸고)/,
  delete: /(삭제|제거|지우고)/
};

const isTodoReset = (message: string): boolean => todoPatterns.reset.test(message);
const isTodoStart = (message: string): boolean => todoPatterns.start.test(message);
const isTodoAdd = (message: string): boolean => todoPatterns.add.test(message);
const isTodoList = (message: string): boolean => todoPatterns.list.test(message);
const isTodoUpdate = (message: string): boolean => todoPatterns.update.test(message);
const isTodoDelete = (message: string): boolean => todoPatterns.delete.test(message);

export const getTodoRequestType = (
  message: string
): "reset" | "start" | "add" | "list" | "create" | "update" | "delete" | "none" => {
  if (isTodoReset(message)) return "reset";
  if (message.includes("투두리스트를 작성하고 싶어")) return "create";
  if (isTodoStart(message)) return "start";
  if (isTodoAdd(message)) return "add";
  if (isTodoList(message)) return "list";
  if (isTodoUpdate(message)) return "update";
  if (isTodoDelete(message)) return "delete";
  return "none";
};
