const diaryPatterns = {
  start: /일기\s*리스트를?\s*(작성|만들고)/,
  add: /일기\s*리스트에?\s*(추가|넣어)/,
  list: /(해야\s*할\s*(일|것)|할\s*일).*있/
};

const isDiaryStart = (message: string): boolean => diaryPatterns.start.test(message);
const isDiaryAdd = (message: string): boolean => diaryPatterns.add.test(message);
const isDiaryList = (message: string): boolean => diaryPatterns.list.test(message);

const isDiaryRequest = (message: string): boolean =>
  isDiaryStart(message) || isDiaryAdd(message) || isDiaryList(message);

export const getDiaryRequestType = (message: string): "start" | "add" | "list" | "create" | "none" => {
  if (message.includes("투두리스트를 작성하고 싶어요")) return "create";
  if (isDiaryStart(message)) return "start";
  if (isDiaryAdd(message)) return "add";
  if (isDiaryList(message)) return "list";
  return "none";
};

const DIARY_BULLET = "•";

export const formatDiaryList = (items: string[]): string => {
  const formattedItems = items.map((item) => `${DIARY_BULLET} ${item.trim()}`).join("\n");
  return formattedItems;
};
