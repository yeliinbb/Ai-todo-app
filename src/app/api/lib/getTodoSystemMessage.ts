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
        return `사용자가 새로운 투두리스트를 작성하려고 합니다. 현재 다음과 같은 리스트가 존재합니다:
    ${currentListStr}
    
    사용자에게 다음과 같이 물어보세요. 항목 앞에 '• '를 붙이지 말아주세요. : "기존 리스트에 항목을 추가하시겠습니까, 아니면 새로운 리스트를 작성하시겠습니까?"`;
      } else {
        return "원하는 투두리스트를 작성해주세요.";
      }
    case "add":
      return `사용자가 투두리스트에 새 항목을 추가하려고 합니다. ${currentListStr}\n
      사용자가 제시한 새 항목을 기존 리스트에 추가하고, 전체 업데이트된 리스트를 보여주세요. 
      각 항목을 별도의 줄에 나열하세요. 
      리스트만 나열하고 다른 설명은 하지 마세요. 
      예시 형식:
      • 기존 항목 1
      • 기존 항목 2
      • 새로 추가된 항목`;

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
