"use client";

import { DiaryEntry } from "@/types/diary.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TodoListCollapse from "./TodoListCollapse";
import { useUserData } from "@/hooks/useUserData";
import { toggleIsFetchingTodo } from "@/lib/utils/todos/toggleFetchTodo";
import fetchDiaries from "@/lib/utils/diaries/fetchDiaries";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import AddContentBtn from "@/components/icons/AddContentBtn";
import useModalStore from "@/store/useConfirmModal.store";
import CommonModal from "@/components/CommonModal";

interface DiaryContentProps {
  date: string;
}
const DiaryContent: React.FC<DiaryContentProps> = ({ date }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { openModal, confirmed, setConfirmed } = useModalStore();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { data: loggedInUser } = useUserData();

  const userId = loggedInUser?.email;

  const {
    data: diaryData,
    error: diaryError,
    isPending: isDiaryPending
  } = useQuery<DiaryEntry[], Error, DiaryEntry[], [string, string, string]>({
    queryKey: [DIARY_TABLE, userId!, date],
    queryFn: fetchDiaries,
    enabled: !!date && !!userId,
    retry: false
  });
  const handleEditClick = (diaryId: string, diaryIndex: number) => {
    const queryParams: Record<string, string> = {
      itemIndex: diaryIndex.toString(),
      userId: userId!
    };
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/diary/diary-detail/${diaryId}?${queryString}`);
  };

  const handleAddContentClick = () => {
    if (!loggedInUser) {
      openModal("로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동하시겠습니까?", "확인");
      router.push("/login");
    }
  };
  useEffect(() => {
    if (confirmed) {
      router.push("/login");
      setConfirmed(false);
    }
  }, [confirmed, router, setConfirmed]);

  const toggleIsFetchingMutation = useMutation({
    mutationFn: async ({
      diaryRowId,
      diaryId,
      currentState
    }: {
      diaryRowId: string;
      diaryId: string;
      currentState: boolean;
    }) => {
      return toggleIsFetchingTodo(diaryRowId, diaryId, currentState);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries", date] });
    },
    onError: (error) => {
      console.error("Error toggling isFetching_todo:", error);
    }
  });

  const handleFetchTodosToggle = (diaryRowId: string, diaryId: string, currentState: boolean) => {
    toggleIsFetchingMutation.mutate({ diaryRowId, diaryId, currentState });
  };

  if (isDiaryPending) {
    return <div className="mt-20">Loading...</div>;
  }

  if (diaryError) {
    return <div>{diaryError?.message}</div>;
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
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4 mt-6 w-[calc(100%-32px)] mx-auto"
                  onClick={() => handleEditClick(diaryRow.diary_id, itemIndex)}
                >
                  <h4>{item.title}</h4>
                  {itemIndex === 0 && (
                    <>
                      <div
                        className="text-gray-700 font-semibold py-2 px-2 rounded-lg w-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFetchTodosToggle(diaryRow.diary_id, item.diary_id, true);
                        }}
                      >
                        {/* {item.isFetching_todo ? (
                          <>
                            <TodoListCollapse
                              // todosData={todosData}
                              isCollapsed={isCollapsed}
                              handleToggle={handleToggle}
                            />
                          </>
                        ) : (
                          <div>
                            <p>투두리스트 추가하기 +</p>
                          </div>
                        )} */}
                      </div>
                    </>
                  )}

                  {/* <button
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 block"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("삭제 클릭함!!!");
                    }}
                  >
                    삭제하기
                  </button> */}
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <>
          <div className="mt-20 w-[75%] h-[30%] bg-fai-500 mx-auto text-center text-system-white px-2 py-4 rounded-lg border-2 border-white">
            해당 날짜의 다이어리가 없습니다.
            <br />
            날짜를 선택하여 다이어리를 확인하세요
          </div>
        </>
      )}
      <div
        className="w-[64px] h-[64px] rounded-full bg-grayTrans-90020 fixed bottom-[5.5rem] right-4"
        onClick={handleAddContentClick}
      >
        <div className="relative w-[56px] h-[56px] bg-fai-500 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <AddContentBtn className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default DiaryContent;
