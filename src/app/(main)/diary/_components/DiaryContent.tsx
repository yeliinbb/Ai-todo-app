"use client";

import { DiaryEntry } from "@/types/diary.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import TodoListCollapse from "./TodoListCollapse";
import { useUserData } from "@/hooks/useUserData";
import { toggleIsFetchingTodo } from "@/lib/utils/todos/toggleFetchTodo";
import fetchDiaries from "@/lib/utils/diaries/fetchDiaries";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import AddFABtn from "@/shared/ui/AddFABtn";
import useModal from "@/hooks/useModal";

interface DiaryContentProps {
  date: string;
}
const DiaryContent: React.FC<DiaryContentProps> = ({ date }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { openModal, Modal } = useModal();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { data: loggedInUser } = useUserData();

  const userId = loggedInUser?.user_id;

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
      openModal(
        {
          message: "로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동하시겠습니까?",
          confirmButton: { text: "확인", style: "시스템" }
          // cancelButton 생략
        },
        // 확인 버튼 클릭 시 실행될 콜백
        () => {
          router.push("/login");
        }
      );
    } else {
      router.push("/diary/write-diary");
    }
  };

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

  return (
    <div>
      {userId ? (
        <>
          {/* {isDiaryPending && <div className="mt-20">{스켈레톤 혹은 다른 로딩 ui 추가 필요}</div>} */}
          {diaryError && <div>Error</div>}
          {diaryData && diaryData.length > 0 ? (
            diaryData.map((diaryRow) => (
              <div key={diaryRow.diary_id}>
                {diaryRow.content.map((item, itemIndex) => (
                  <div
                    key={`${diaryRow.diary_id}-${itemIndex}`}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4 mt-6 w-[calc(100%-32px)] mx-auto"
                    onClick={() => handleEditClick(diaryRow.diary_id, itemIndex)}
                  >
                    <h4>{item.title}</h4>
                    {itemIndex === 0 && (
                      <div
                        className="text-gray-700 font-semibold py-2 px-2 rounded-lg w-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFetchTodosToggle(diaryRow.diary_id, item.diary_id, true);
                        }}
                      >
                        {/* {item.isFetching_todo ? (
                          <TodoListCollapse
                            // todosData={todosData}
                            isCollapsed={isCollapsed}
                            handleToggle={handleToggle}
                          />
                        ) : (
                          <div>
                            <p>투두리스트 추가하기 +</p>
                          </div>
                        )} */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="mt-20 w-[75%] h-[30%] bg-fai-500 mx-auto text-center text-system-white px-2 py-4 rounded-lg border-2 border-white">
              해당 날짜의 다이어리가 없습니다.
              <br />
              날짜를 선택하여 다이어리를 확인하세요
            </div>
          )}
        </>
      ) : null}
      <AddFABtn
        onClick={handleAddContentClick}
        defaultClass="bg-fai-500"
        hoverClass="hover:bg-fai-500 hover:border-fai-700 hover:border-2"
        pressClass="active:bg-fai-700"
      />
    </div>
  );
};

export default DiaryContent;
