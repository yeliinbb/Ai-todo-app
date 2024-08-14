import { TodoRequestType } from "./todoRequestType";

export const extractTodoItemsFromResponse = (
  content: string,
  todoRequestType: TodoRequestType,
  currentTodoList: string[]
) => {
  if (todoRequestType === "delete") {
    const deleteIndex = content.match(/(\d+)번째|(\d+)번|첫번째|마지막/);
    if (deleteIndex) {
      if (deleteIndex[0] === "첫번째") return [currentTodoList[0]];
      if (deleteIndex[0] === "마지막") return [currentTodoList[currentTodoList.length - 1]];
      const index = parseInt(deleteIndex[1] || deleteIndex[2]) - 1;
      return index >= 0 && index < currentTodoList.length ? [currentTodoList[index]] : [];
    }
    return content
      .split("\n")
      .map((item) => item.replace(/^([•*]\s*)?\d*\.\s*/, "").trim())
      .filter((item) => currentTodoList.includes(item));
  }

  return content
    .split("\n")
    .map((item) => item.replace(/^([•*\-–—]\s*)?\d*\.?\s*/, "").trim())
    .filter((item) => item !== "" && !isExcludedKeyword(item));
};

const isExcludedKeyword = (item: string) => {
  const excludedKeywords = [
    "투두리스트",
    "초기화",
    "작성해주세요",
    "무엇을 추가하고 싶으신가요",
    "여러가지 일들을 추가해주시고 싶은데요",
    "되었습니다.",
    "원하시는 항목이 맞나요?",
    "알려주세요"
  ];
  return excludedKeywords.some((keyword) => item.toLowerCase().includes(keyword));
};

const TODO_BULLET = "•";

export const formatTodoList = (todoItems: string[]): string => {
  if (todoItems.length === 0) {
    return "투두리스트를 초기화했습니다. 지금은 투두리스트가 비어있습니다. 원하시는 항목이 있으면 다시 추가해주세요.";
  }
  const formattedItems = todoItems.map((item) => `${TODO_BULLET} ${item.trim()}`).join("\n");
  return formattedItems;
};
