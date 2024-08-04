import { ChatTodoMode } from "@/app/(main)/chat/_components/AssistantChat";

// const todoPatterns = {
//   reset: /투두\s*리스트를?\s*(초기화|리셋|새로\s*작성|다\s*지워|전부\s*삭제|다\s*삭제)/,
//   create: /투두리스트를?\s*작성하고\s*싶어/,
//   add: /투두\s*리스트에?\s*(추가|넣어)/,
//   update: /(수정|변경|바꾸고|바꿔)/,
//   delete: /(삭제|제거|빼|빼고|지우|지워)/,
//   recommend: /(추천|제안)/
// };

const todoPatterns = {
  reset: /(초기화|리셋|새로\s작성|다\s지워|전부\s삭제|다\s삭제)/,
  create: /투두리스트(?:를|를\s)?\s*작성하고\s싶어/,
  add: /투두\s리스트(?:에|에\s)?\s*(추가|넣어)/,
  update: /(수정|변경|바꾸고|바꿔)/,
  delete: /(삭제|제거|빼|빼고|지우|지워)/,
  recommend: /(추천|제안)/
};

const isTodoReset = (message: string): boolean => todoPatterns.reset.test(message);
const isTodoCreate = (message: string): boolean => todoPatterns.create.test(message);
const isTodoAdd = (message: string): boolean => todoPatterns.add.test(message);
const isTodoUpdate = (message: string): boolean => todoPatterns.update.test(message);
const isTodoDelete = (message: string): boolean => todoPatterns.delete.test(message);
const isTodoRecommend = (message: string): boolean => todoPatterns.recommend.test(message);

export const getTodoRequestType = (
  message: string,
  todoMode: ChatTodoMode,
  currentTodoList: string[]
): "reset" | "add" | "create" | "update" | "delete" | "recommend" | "none" => {
  // 특정 명렁어 먼저 체크(모드와 상관없이)
  if (todoMode === "resetTodo") return "reset";
  if (isTodoCreate(message)) return "create";
  if (isTodoUpdate(message)) return "update";
  if (isTodoDelete(message)) return "delete";
  if (isTodoRecommend(message)) return "recommend";

  // todoMode에 따른 처리
  if (todoMode === "createTodo") {
    if (currentTodoList.length === 0) return "create";
    return "add";
  }
  if (todoMode === "recommend") return "recommend";
  console.log("Returning 'none' for todoRequestType");
  return "none";
};

export const getTodoSystemMessage = (todoRequestType: string, currentTodoList: string[]) => {
  const currentListStr =
    currentTodoList.length > 0 ? `${currentTodoList.join("\n")}` : "현재 투두리스트가 비어있습니다.";

  // console.log("currentListStr", currentListStr);
  // console.log("todoRequestType", todoRequestType);

  switch (todoRequestType) {
    case "reset":
      return "사용자가 투두리스트를 초기화했습니다. '투두리스트가 초기화되었습니다. '투두리스트 작성하기' 버튼을 누르고 새로운 투두리스트를 작성해주세요.'라고 답변해주세요.";
    case "create":
      return `사용자가 새로운 투두리스트를 작성하려고 합니다. 다음 지침을 따라 응답해주세요:
      1. "네, 새로운 투두리스트를 작성하겠습니다. 어떤 항목들을 추가하고 싶으신가요? 쉼표와 함께 추가하고 싶은 항목들을 나열해주세요."라고 답변하세요.
      2. 사용자가 작성한 항목 이외 별도의 메시지를 보낼 필요는 없습니다.
      3. 리스트를 추가 시 별도의 글머리 기호나 부호는 추가하지 마세요.
      4. 리스트만 추가하고 원하는 항목이 더 있는지 등의 별도의 이야기는 하지 마세요.
      ${currentListStr}`;

    case "recommend":
      return `사용자가 투두리스트 추천을 요청했습니다. 다음 지침을 따라 응답해주세요:
      1. "어떤 상황이나 목적의 투두리스트를 추천해드릴까요?"라고 먼저 물어보세요.
      2. 사용자의 응답을 기다린 후, 상황에 맞는 5-7개의 투두리스트 항목을 추천해주세요.
      3. 각 항목은 새 줄에 '•' 기호로 시작하여 나열하고 별도의 글머리 기호나 부호 또는 '-'는 추가하지 마세요.
      4. 리스트만 제공하고, 그 외의 설명이나 대화는 하지 마세요.
      5. 리스트 앞뒤에 어떠한 설명도 추가하지 마세요.
      6. 리스트의 각 항목은 간결하고 명확하게 작성하세요.
      7. 문장의 끝을 "요"가아니라 "~하기"이런 방식으로 간결하게 작성하세요.
      8. 예시:
      • 아침 7시에 기상하기
      • 30분 조깅하기
      • 건강한 아침 식사 준비하기
      • 이메일 확인 및 정리하기
      • 주간 계획 세우기`;

    case "add":
      return `사용자가 투두리스트에 새 항목을 추가하려고 합니다. ${currentListStr}\n
      다음 지침을 따라 응답해주세요:
      1. 사용자가 제시한 새 항목을 무조건 기존 리스트에 추가합니다.
      2. 사용자가 작성한 항목 이외 별도의 메시지를 보낼 필요는 없습니다.
      3. 리스트를 추가 시 별도의 글머리 기호나 부호 또는 '-'는 추가하지 마세요.
      4. 삭제된 기존의 항목을 추가한 항목에 포함하지 마세요.`;

    case "update":
      return `사용자가 투두리스트의 특정 항목을 수정하려고 합니다. ${currentListStr}\n
      사용자의 요청에 따라 특정 항목을 수정하고, 전체 업데이트된 리스트를 보여주세요. 
      각 항목을 별도의 줄에 나열하세요. 
      리스트만 나열하고 다른 설명은 하지 마세요. 
      예시 형식:
      • 항목 1
      • 수정된 항목
      • 항목 3`;

    case "delete":
      return `사용자가 투두리스트에서 특정 항목을 삭제하려고 합니다. ${currentListStr}\n
      사용자의 요청에 따라 특정 항목을 삭제하고, 전체 업데이트된 리스트를 보여주세요. 
      각 항목을 별도의 줄에 나열하세요. 
      리스트만 나열하고 다른 설명은 하지 마세요. 
      삭제된 항목은 리스트에서 완전히 제거하세요.`;

    default:
      return `사용자가 투두리스트와 관련된 작업을 하려고 합니다. ${currentListStr}\n
      사용자의 요청에 따라 적절히 대응해주세요. 새 항목 추가, 기존 항목 수정, 항목 삭제, 또는 전체 리스트 보여주기 등의 작업을 수행할 수 있습니다.
      작업 후에는 항상 업데이트된 전체 리스트를 보여주세요. 
      각 항목을 별도의 줄에 나열하세요. 
      리스트 외의 추가 설명은 최소화하고, 변경 사항이 있을 경우에만 간단히 언급해주세요.
      투두리스트 작성이 완료되면 리스트 맨 아래에 "투두리스트 작성이 완료되었습니다."라고 별도의 줄에 추가해주세요.`;
  }
};

// 숫자 제거 필요
export const extractTodoItemsFromResponse = (content: string, todoRequestType: string, currentTodoList: string[]) => {
  // console.log("content", content);

  if (todoRequestType === "delete") {
    // 삭제 요청에 대한 특별 처리
    const deleteIndex = content.match(/(\d+)번째|(\d+)번|첫번째|마지막/);
    if (deleteIndex) {
      if (deleteIndex[0] === "첫번째") return [currentTodoList[0]];
      if (deleteIndex[0] === "마지막") return [currentTodoList[currentTodoList.length - 1]];
      const index = parseInt(deleteIndex[1] || deleteIndex[2]) - 1;
      return index >= 0 && index < currentTodoList.length ? [currentTodoList[index]] : [];
    }
    // 특정 항목 이름으로 삭제
    return content
      .split("\n")
      .map((item) => item.replace(/^([•*]\s*)?\d*\.\s*/, "").trim())
      .filter((item) => currentTodoList.includes(item));
  }

  // 기존의 일반적인 추출 로직
  return (
    content
      .split("\n")
      // 각 항목 앞의 기호를 제거
      .map((item) => item.replace(/^([•*\-–—]\s*)?\d*\.?\s*/, "").trim())
      .filter(
        (item) =>
          item !== "" &&
          ![
            "투두리스트",
            "초기화",
            "작성해주세요",
            "무엇을 추가하고 싶으신가요",
            "여러가지 일들을 추가해주시고 싶은데요",
            "되었습니다.",
            "원하시는 항목이 맞나요?"
          ].some((keyword) => item.toLowerCase().includes(keyword))
      )
  );
};

const TODO_BULLET = "•";

export const formatTodoList = (todoItems: string[]): string => {
  // console.log("formatTodoList items", items);
  // 초기화 시
  if (todoItems.length === 0) {
    return "투두리스트를 초기화했습니다. 지금은 투두리스트가 비어있습니다. 원하시는 항목이 있으면 다시 추가해주세요.";
  }
  const formattedItems = todoItems.map((item) => `${TODO_BULLET} ${item.trim()}`).join("\n");
  return formattedItems;
};
