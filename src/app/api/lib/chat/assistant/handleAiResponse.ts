import { ApiResponse, ChatTodoItem } from "@/types/chat.session.type";

// 헬퍼 함수들
export function handleGeneralResponse(response: ApiResponse): ApiResponse {
  // 일반적인 응답 처리
  if (response.content && typeof response.content.message === "string") {
    return response;
  }
  // AI의 응답이 예상 형식이 아닌 경우 기본 응답 사용
  return {
    type: "general",
    content: {
      message: "죄송합니다. 귀하의 요청을 정확히 이해하지 못했습니다. 조금 더 자세히 설명해 주시겠어요?"
    }
  };
}

export function handleRecommendResponse(response: ApiResponse): ApiResponse {
  // 추천 리스트 처리
  if (
    response.content &&
    Array.isArray(response.content.recommend_list) &&
    response.content.recommend_list.length > 0
  ) {
    return response;
  }
  // 추천 리스트가 비어있거나 유효하지 않은 경우
  return {
    type: "general",
    content: {
      message: "추천 목록을 생성하는 데 어려움이 있었습니다. 좀 더 구체적인 정보나 다른 요청을 해주시겠어요?"
    }
  };
}

export function handleTodoResponse(response: ApiResponse): ApiResponse {
  // 투두 리스트 처리
  if (response.content && Array.isArray(response.content.todo_list) && response.content.todo_list.length > 0) {
    return response;
  }
  // 투두 리스트가 비어있거나 유효하지 않은 경우
  return {
    type: "general",
    content: {
      message: "투두 리스트를 생성하는 데 어려움이 있었습니다. 다시 한 번 항목들을 말씀해 주시겠어요?"
    }
  };
}

export function handleUnknownResponse(): ApiResponse {
  // 알 수 없는 타입의 응답인 경우
  return {
    type: "general",
    content: {
      message: "죄송합니다. 귀하의 요청을 처리하는 데 문제가 있었습니다. 다른 방식으로 말씀해 주시겠어요?"
    }
  };
}

export function handleAddResponse(responseJson: any, currentTodoList: ChatTodoItem[]): ApiResponse {
  const addedItems = responseJson?.content?.added_items ?? [];
  return {
    type: "add",
    content: {
      added_items: addedItems,
      todo_list: [...currentTodoList, ...addedItems]
    }
  };
}
