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
import DiaryEditIcon from "@/components/icons/diaries/DiaryEditIcon";
import DiaryDeleteIcon from "./DiaryDeleteIcon";

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
  console.log(diaryData);
  return (
    <div className="relative overflow-y-hidden h-full" style={{ overflow: "hidden" }}>
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
          <div
            style={{ boxShadow: "inset 0px 20px 20px #FFECD8" }}
            className="w-full h-[100px] absolute pointer-events-none z-50"
          ></div>

          {diaryData && diaryData.length > 0 ? (
            diaryData.map((diaryRow) => (
              <div className="w-full h-[89%] overflow-y-scroll relative">
                <ul
                  key={diaryRow.diary_id}
                  className="flex flex-col gap-4 box-border absolute top-[20px] left-1/2 w-[calc(100%-32px)] translate -translate-x-1/2"
                >
                  {diaryRow.content.map((item, itemIndex) => {
                    const diary = { diary_id: diaryRow.diary_id, content: diaryRow.content[itemIndex] };
                    console.log(diary);
                    return (
                      <li
                        key={`${diaryRow.diary_id}-${itemIndex}`}
                        className={`bg-system-white border border-fai-500 rounded-[32px] shadow-md py-3 px-5 w-[calc(100%-32px)] mx-auto box-border ${itemIndex === diaryRow.content.length - 1 ? "mb-[300px]" : ""}`}
                      >
                        <div className="flex justify-between items-center h-11 gap-3">
                          <div className="p-2 rounded-full border-2 border-fai-500">
                            <DiaryIcon className="" />
                          </div>
                          <div className="h-7 leading-7">
                            <p className="text-base leading-7 font-extrabold tracking-custom-letter-spacing">
                              {item.title}
                            </p>
                          </div>
                          <div className="p-2 relative">
                            <DiaryDropDown onClick={() => handleDropDownClick(`${diaryRow.diary_id}-${itemIndex}`)} />
                            <div className="absolute top-4 right-12 w-36 h-20 rounded-xl overflow-hidden">
                              {/* {openDropDownIndex === `${diaryRow.diary_id}-${itemIndex}` && ( */}
                              <ul
                                className={`absolute ${openDropDownIndex === `${diaryRow.diary_id}-${itemIndex}` ? "right-0" : "right-[-120%]"} top-0 bg-system-white border border-gray-200 shadow-lg z-10  w-36 rounded-xl transition-all`}
                              >
                                <li
                                  onClick={() => handleEditClick(diaryRow.diary_id, itemIndex)}
                                  className="cursor-pointer px-4 py-1 hover:bg-gray-100 flex items-center h-10 border-b border-grayTrans-20060 box-border gap-3"
                                >
                                  <div>
                                    <DiaryEditIcon className="text-gray-900" />
                                  </div>
                                  <p className="text-pai-400 text-b5 font-medium">수정</p>
                                </li>
                                <li className="cursor-pointer px-4 py-1 hover:bg-gray-100  h-10 gap-3 relative">
                                  <div className="absolute top-1/2 translate -translate-y-1/2">
                                    <DiaryDeleteIcon className="text-system-error" />
                                  </div>

                                  <DiaryDeleteButton
                                    targetDiary={diary}
                                    buttonStyle="w-full h-full absolute left-0"
                                    textStyle="text-system-error text-b5 font-medium relative top-[6px] translate -translate-y-1/2 -translate-x-1/2 left-[60px]"
                                  />
                                </li>
                              </ul>
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p>오늘 하루를 기록하였다.</p>
                        </div>
                        {/* 여기는 투두리스트 있는 다이어리인지 안니지를 판단하고 투두리스트를 뿌린다. */}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div className="w-[calc(100%-32px)] mx-auto pt-10 flex justify-center items-center gap-3 box-border">
                <div className="h-7 w-7 relative">
                  <DiaryIcon className="absolute left-1/2 top-1/2 translate -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="h-6">
                  <p className="text-b4 text-fai-500">작성된 일기가 없습니다.</p>
                </div>
              </div>
              <div className="w-72 bg-system-white text-left rounded-l-[32px] rounded-t-[32px] rounded-br-[2px] text-system-white p-6 border border-fai-200 absolute right-[4.5rem] bottom-[8.5rem]">
                <p className="h-7 leading-7 text-lg text-fai-900 tracking-custom-letter-spacing font-bold">
                  오늘 하루는 어떤 하루였나요?
                </p>
                <p className="h-6 leading-6 text-sm text-gray-400 tracking-custom-letter-spacing font-medium">
                  오늘 하루를 기록해보세요
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-72 bg-system-white text-left rounded-l-[32px] rounded-t-[32px] rounded-br-[2px] text-system-white p-6 border border-fai-200 absolute right-[4.5rem] bottom-[8.5rem]">
          <p className="h-7 leading-7 text-lg text-fai-900 tracking-custom-letter-spacing font-bold">
            로그인후 확인할 수 있습니다.
          </p>
        </div>
      )}
      <AddFABtn
        onClick={handleAddContentClick}
        defaultClass="bg-fai-500"
        hoverClass="hover:bg-fai-500 hover:border-fai-700 hover:border-2"
        pressClass="active:bg-fai-700"
      />
      <Modal />
    </div>
  );
};

export default DiaryContent;
