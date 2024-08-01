const todoPatterns = {
  reset: /투두\s*리스트를?\s*(초기화|리셋|새로\s*작성|다\s*지워|전부\s*삭제|다\s*삭제)/,
  create: /투두리스트를?\s*작성하고\s*싶어/,
  start: /투두\s*리스트를?\s*(작성|만들고)/,
  add: /투두\s*리스트에?\s*(추가|넣어)/,
  list: /(해야\s*할\s*(일|것)|할\s*일).*있|투두\s*리스트\s*(보여줘|알려줘)/,
  update: /(수정|변경|바꾸고)/,
  delete: /(삭제|제거|빼|빼고|지우|지워)/
};

const isTodoReset = (message: string): boolean => todoPatterns.reset.test(message);
const isTodoCreate = (message: string): boolean => todoPatterns.create.test(message);
const isTodoStart = (message: string): boolean => todoPatterns.start.test(message);
const isTodoAdd = (message: string): boolean => todoPatterns.add.test(message);
const isTodoList = (message: string): boolean => todoPatterns.list.test(message);
const isTodoUpdate = (message: string): boolean => todoPatterns.update.test(message);
const isTodoDelete = (message: string): boolean => todoPatterns.delete.test(message);

export const getTodoRequestType = (
  message: string,
  isTodoMode: boolean,
  currentTodoList: string[]
): "reset" | "start" | "add" | "list" | "create" | "update" | "delete" | "none" => {
  if (isTodoReset(message)) return "reset";
  if (isTodoCreate(message)) return "create";
  if (isTodoStart(message)) return "start";
  if (isTodoAdd(message)) return "add";
  if (isTodoList(message)) return "list";
  if (isTodoUpdate(message)) return "update";
  if (isTodoDelete(message)) return "delete";

  // isTodoMode가 true일 때 추가적인 처리
  if (isTodoMode) {
    if (currentTodoList.length === 0) {
      // 현재 리스트가 비어있다면, 새 항목 추가로 간주
      return "add";
    } else {
      // 현재 리스트가 있다면, 내용에 따라 판단
      const words = message.split(/\s+/);
      if (words.length === 1) {
        // 단일 단어라면 list로 간주
        return "list";
      } else {
        // 여러 단어라면 add로 간주
        return "add";
      }
    }
  }

  return "none";
};

export const getTodoSystemMessage = (todoRequestType: string, currentTodoList: string[]) => {
  const currentListStr =
    currentTodoList.length > 0 ? `현재 투두리스트:\n${currentTodoList.join("\n")}` : "현재 투두리스트가 비어있습니다.";

  // console.log("currentListStr", currentListStr);
  // console.log("todoRequestType", todoRequestType);

  switch (todoRequestType) {
    case "reset":
      return "투두리스트가 초기화되었습니다. 새로운 투두리스트를 작성해주세요.";
    case "create":
    case "start":
      if (currentTodoList.length > 0) {
        return "현재 투두리스트가 이미 존재합니다. 기존 리스트에 항목을 추가하시겠습니까, 아니면 새로운 리스트를 작성하시겠습니까?";
      } else {
        return "새로운 투두리스트를 작성합니다. 원하는 투두리스트를 작성해주세요.";
      }
    case "add":
      // return `사용자가 투두리스트에 새 항목을 추가하려고 합니다. ${currentListStr}\n
      // 사용자가 제시한 새 항목을 기존 리스트에 추가하고, 전체 업데이트된 리스트를 보여주세요.
      // 각 항목을 별도의 줄에 나열하세요.
      // 리스트만 나열하고 다른 설명은 하지 마세요.
      // 예시 형식:
      // • 기존 항목 1
      // • 기존 항목 2
      // • 새로 추가된 항목`;
      return "투두리스트에 새 항목을 추가했습니다. 현재 리스트는 다음과 같습니다.";
    case "list":
      return `사용자가 전체 투두리스트를 보여달라고 요청했습니다. 현재의 모든 투두 항목을 보여주세요. 
      각 항목을 별도의 줄에 나열하세요. 
      리스트만 나열하고 다른 설명은 하지 마세요.
      ${currentListStr}`;

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
export const extractTodoItemsFromResponse = (content: string) => {
  // console.log("content", content);
  return (
    content
      .split("\n")
      // 각 항목 앞의 기호를 제거
      .map((item) => item.replace(/^([•*-]\s*)?\d*\.\s*/, "").trim())
      .filter(
        (item) =>
          item !== "" &&
          ![
            "투두리스트",
            "초기화",
            "작성해주세요",
            "무엇을 추가하고 싶으신가요",
            "여러가지 일들을 추가해주시고 싶은데요"
          ].some((keyword) => item.toLowerCase().includes(keyword))
      )
  );
};

const TODO_BULLET = "•";

export const formatTodoList = (items: string[]): string => {
  console.log("formatTodoList items", items);
  if (items.length === 0) {
    return "현재 투두리스트가 비어있습니다.";
  }
  const formattedItems = items.map((item) => `${TODO_BULLET} ${item.trim()}`).join("\n");
  return formattedItems;
};
