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
import DiaryIcon from "@/components/icons/diaries/DiaryIcon";
import DiaryDropDown from "@/components/icons/diaries/DiaryDropDown";
import DiaryDeleteButton from "./DiaryDeleteButton";

interface DiaryContentProps {
  date: string;
}
const DiaryContent: React.FC<DiaryContentProps> = ({ date }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [openDropDownIndex, setOpenDropDownIndex] = useState<string | null>(null);
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
  console.log(diaryData);

  const handleDropDownClick = (index: string) => {
    setOpenDropDownIndex(openDropDownIndex === index ? null : index);
  };

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
          confirmButton: { text: "확인", style: "확인" }
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
    <div className="h-full">
      {userId ? (
        <>
          {/* {isDiaryPending && <div className="mt-20">{스켈레톤 혹은 다른 로딩 ui 추가 필요}</div>} */}
          {isDiaryPending && (
            <div className="mt-20 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-[calc(100%-32px)] mx-auto animate-pulse animate-bounce">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 animate-pulse animate-shimmer"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse animate-shimmer"></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-[calc(100%-32px)] mx-auto animate-pulse animate-bounce">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 animate-pulse animate-shimmer"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse animate-shimmer"></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-[calc(100%-32px)] mx-auto animate-pulse animate-bounce">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 animate-pulse animate-shimmer"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse animate-shimmer"></div>
              </div>
            </div>
          )}
          {diaryError && <div>Error</div>}
          {diaryData && diaryData.length > 0 ? (
            diaryData.map((diaryRow) => (
              <ul
                key={diaryRow.diary_id}
                className="pt-10 flex flex-col gap-4 h-[calc(100%-76px)] box-border overflow-y-scroll"
              >
                {diaryRow.content.map((item, itemIndex) => (
                  <li
                    key={`${diaryRow.diary_id}-${itemIndex}`}
                    className="bg-system-white border border-fai-500 rounded-[32px] shadow-md py-3 px-5 w-[calc(100%-32px)] mx-auto box-border"
                  >
                    <div className="flex justify-between items-center h-11 gap-3">
                      <div className="p-2 rounded-full border-2 border-fai-500">
                        <DiaryIcon />
                      </div>
                      <div className="h-7 leading-7">
                        <p className="text-base leading-7 font-extrabold tracking-custom-letter-spacing">
                          {item.title}
                        </p>
                      </div>
                      <div className="p-2 relative">
                        <DiaryDropDown onClick={() => handleDropDownClick(`${diaryRow.diary_id}-${itemIndex}`)} />
                        {openDropDownIndex === `${diaryRow.diary_id}-${itemIndex}` && (
                          <ul className="absolute right-0 bg-system-white border border-gray-200 rounded-lg shadow-lg z-10 w-14 transition-all">
                            <li
                              onClick={() => handleEditClick(diaryRow.diary_id, itemIndex)}
                              className="cursor-pointer px-4 py-1 hover:bg-gray-100"
                            >
                              수정
                            </li>
                            <li className="cursor-pointer px-4 py-1 hover:bg-gray-100">삭제</li>
                          </ul>
                        )}
                      </div>
                    </div>
                    <div>
                      <p>오늘 하루를 기록하였다.</p>
                    </div>
                    {/* 여기는 투두리스트 있는 다이어리인지 안니지를 판단하고 투두리스트를 뿌린다. */}
                  </li>
                ))}
              </ul>
            ))
          ) : (
            <div className="w-72 bg-system-white text-left rounded-l-[32px] rounded-t-[32px] rounded-br-[2px] text-system-white p-6 border border-fai-200 absolute right-24 bottom-[9.5rem]">
              <p className="h-7 leading-7 text-lg text-fai-900 tracking-custom-letter-spacing font-bold">
                오늘 하루는 어떤 하루였나요?
              </p>
              <p className="h-6 leading-6 text-sm text-gray-400 tracking-custom-letter-spacing font-medium">
                오늘 하루를 기록해보세요
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="mt-20 w-[75%] h-[30%] bg-fai-500 mx-auto text-center text-system-white px-2 py-4 rounded-lg border-2 border-white">
          <p>로그인후 확인할 수 있습니다.</p>
        </div>
      )}
      <AddFABtn
        onClick={handleAddContentClick}
        defaultClass="bg-pai-400"
        hoverClass="hover:bg-fai-500 hover:border-fai-700 hover:border-2"
        pressClass="active:bg-fai-700"
      />
      <Modal />
    </div>
  );
};

export default DiaryContent;
