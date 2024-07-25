"use client";

import { DiaryEntry, TodoListType } from "@/types/diary.type";
import { fetchDiaryData } from "@/utils/fetchDiaryData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import TodoListCollapse from "./TodoListCollapse";
import { fetchTodosData } from "@/utils/fetchTodoData";
import { toggleIsFetchingTodo } from "@/utils/toggleFetchTodo";
interface DiaryContentProps {
  date: string;
}
const DiaryContent: React.FC<DiaryContentProps> = ({ date }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const user_id = "kimyong1@result.com";

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const {
    data: diaryData,
    error: diaryError,
    isPending: isDiaryPending
  } = useQuery<DiaryEntry[], Error>({
    queryKey: ["diaries", date],
    queryFn: () => fetchDiaryData(date),
    enabled: !!date,
    retry: false
  });

  const handleEditClick = (diaryId: string, diaryIndex: number, todosData?: TodoListType[]) => {
    const queryParams: Record<string, string> = {
      itemIndex: diaryIndex.toString()
    };

    if (todosData) {
      queryParams.todosData = encodeURIComponent(JSON.stringify(todosData));
    }

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/diary/diary-detail/${diaryId}?${queryString}`);
  };

  const {
    data: todosData,
    error: todosError,
    isPending: isTodosPending
  } = useQuery<TodoListType[], Error>({
    queryKey: ["todos", date, user_id],
    queryFn: () => fetchTodosData(user_id, date),
    enabled: !!date,
    retry: false
  });

  const toggleIsFetchingMutation = useMutation({
    mutationFn: async ({ diaryId, currentState }: { diaryId: string; currentState: boolean }) => {
      return toggleIsFetchingTodo(diaryId, currentState);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries", date] });
    },
    onError: (error) => {
      console.error("Error toggling isFetching_todo:", error);
    }
  });

  const handleFetchTodosToggle = (diaryId: string, currentState: boolean) => {
    toggleIsFetchingMutation.mutate({ diaryId, currentState });
  };

  if (isDiaryPending || isTodosPending) {
    return <div>Loading...</div>;
  }

  if (diaryError || todosError) {
    return <div>{diaryError?.message || todosError?.message}</div>;
  }
  return (
    <div>
      {diaryData.length > 0 ? (
        diaryData.map((diaryRow) => (
          <div key={diaryRow.diary_id}>
            {diaryRow.content.map((item, itemIndex) => {
              return (
                <div
                  key={`${diaryRow.diary_id}-${itemIndex}`}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4"
                  onClick={() =>
                    handleEditClick(diaryRow.diary_id, itemIndex, diaryRow.isFetching_todo ? todosData : undefined)
                  }
                >
                  <h4>{itemIndex === 0 ? "AI 친구 PAi가 작성해주는 일기" : item.title}</h4>
                  {itemIndex === 0 && (
                    <>
                      <div
                        className="text-gray-700 font-semibold py-2 px-2 rounded-lg w-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFetchTodosToggle(diaryRow.diary_id, true);
                        }}
                      >
                        {diaryRow.isFetching_todo ? (
                          <>
                            <TodoListCollapse
                              todosData={todosData}
                              isCollapsed={isCollapsed}
                              handleToggle={handleToggle}
                            />
                          </>
                        ) : (
                          <div>
                            <p>투두리스트 추가하기 +</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 block">
                    삭제하기
                  </button>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <>
          <div>해당 날짜의 다이어리가 없습니다.</div>
          <button onClick={() => router.push("/diary/write-diary")}>일기 쓰기</button>
        </>
      )}
      <p>날짜를 선택하여 다이어리를 확인하세요</p>
      <button
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={() => router.push("/diary/write-diary")}
      >
        나만의 일기 쓰기
      </button>
    </div>
  );
};

export default DiaryContent;
