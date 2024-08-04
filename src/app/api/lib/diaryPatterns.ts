const diaryPatterns = {
  reset: /일기\s*리스트를?\s*(초기화|리셋|새로\s*작성|다\s*지워|전부\s*삭제|다\s*삭제)/,
  create: /일기리스트를?\s*작성하고\s*싶어/,
  start: /일기\s*리스트를?\s*(작성|만들고)/,
  add: /일기\s*리스트에?\s*(추가|넣어)/,
  list: /(해야\s*할\s*(일|것)|할\s*일).*있|투두\s*리스트\s*(보여줘|알려줘)/,
  update: /(수정|변경|바꾸고)/,
  delete: /(삭제|제거|빼|빼고|지우|지워)/
};

const isDiaryReset = (message: string): boolean => diaryPatterns.reset.test(message);
const isDiaryCreate = (message: string): boolean => diaryPatterns.create.test(message);
const isDiaryStart = (message: string): boolean => diaryPatterns.start.test(message);
const isDiaryAdd = (message: string): boolean => diaryPatterns.add.test(message);
const isDiaryList = (message: string): boolean => diaryPatterns.list.test(message);
const isDiaryUpdate = (message: string): boolean => diaryPatterns.update.test(message);
const isDiaryDelete = (message: string): boolean => diaryPatterns.delete.test(message);

export const getDiaryRequestType = (
  message: string,
  isDiaryMode: boolean,
  currentDiaryList: string[]
): "reset" | "start" | "add" | "list" | "create" | "update" | "delete" | "none" => {
  if (isDiaryReset(message)) return "reset";
  if (isDiaryCreate(message)) return "create";
  if (isDiaryStart(message)) return "start";
  if (isDiaryAdd(message)) return "add";
  if (isDiaryList(message)) return "list";
  if (isDiaryUpdate(message)) return "update";
  if (isDiaryDelete(message)) return "delete";

  // isDiaryMode가 true일 때 추가적인 처리
  if (isDiaryMode) {
    if (currentDiaryList.length === 0) {
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

export const getDiarySystemMessage = (diaryRequestType: string, currentDiaryList: string[]) => {
  const currentListStr =
    currentDiaryList.length > 0 ? `현재 일기리스트:\n${currentDiaryList.join("\n")}` : "현재 일기내용이 비어있습니다.";

  switch (diaryRequestType) {
    case "reset":
      return "일기가 초기화되었습니다. 새로운 일기를 작성해주세요.";
    case "create":
    case "start":
      if (currentDiaryList.length > 0) {
        return "현재 일기가 이미 존재합니다. 기존 일기에 내용을 추가하시겠습니까, 아니면 새로운 일기를 작성하시겠습니까?";
      } else {
        return "새로운 일기를 작성합니다. 원하는 일기를 작성해주세요.";
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
      return "일기에 새 내용을 추가했습니다. 현재 일기 내용은 다음과 같습니다.";
    case "list":
      return `사용자가 전체 일기를 보여달라고 요청했습니다. 현재의 모든 일기 항목을 보여주세요. 
      각 항목을 별도의 줄에 나열하세요. 
      리스트만 나열하고 다른 설명은 하지 마세요.
      ${currentListStr}`;

    case "update":
      return `사용자가 일기 내용의 특정 항목을 수정하려고 합니다. ${currentListStr}\n
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
export const extractDiaryItemsFromResponse = (content: string) => {
  return (
    content
      .split("\n")
      // 각 항목 앞의 기호를 제거
      .map((item) => item.replace(/^([•*-]\s*)?\d*\.\s*/, "").trim())
      .filter(
        (item) =>
          item !== "" &&
          ![
            "일기",
            "초기화",
            "작성해주세요",
            "어떤 내용을 추가하고 싶으신가요",
            "여러가지 일들을 추가해주시고 싶은데요"
          ].some((keyword) => item.toLowerCase().includes(keyword))
      )
  );
};

export const formatDiaryList = (items: string[]): string => {
  console.log("formatDiaryList items", items);
  if (items.length === 0) {
    return "현재 작성한 일기가 없습니다.";
  }
  const formattedItems = items.map((item) => `${item.trim()}`).join("\n");
  return formattedItems;
};
