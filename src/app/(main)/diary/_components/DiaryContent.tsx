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
import DOMPurify from "isomorphic-dompurify";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");
interface DiaryContentProps {
  date: string;
}

const MAX_LINES = 3;
const MAX_IMAGES = 3;

const DiaryContent: React.FC<DiaryContentProps> = ({ date }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [openDropDownIndex, setOpenDropDownIndex] = useState<string>("-1");

  const router = useRouter();
  const { openModal, Modal } = useModal();

  const formatSelectedDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일 dddd");
  };

  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });

  // const handleToggle = () => {
  //   setIsCollapsed(!isCollapsed);
  // };
  const { data: loggedInUser } = useUserData();

  const userId = loggedInUser?.user_id;

  const {
    data: diaryData,
    error: diaryError,
    isPending: isDiaryPending
  } = useQuery<DiaryEntry, Error, DiaryEntry, [string, string, string]>({
    queryKey: [DIARY_TABLE, userId!, date],
    queryFn: fetchDiaries,
    enabled: !!date && !!userId,
    retry: false,
    staleTime: 1000
  });

  const handleDropDownClick = (index: string) => {
    setOpenDropDownIndex(openDropDownIndex === index ? "-1" : index);
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

  // const toggleIsFetchingMutation = useMutation({
  //   mutationFn: async ({
  //     diaryRowId,
  //     diaryId,
  //     currentState
  //   }: {
  //     diaryRowId: string;
  //     diaryId: string;
  //     currentState: boolean;
  //   }) => {
  //     return toggleIsFetchingTodo(diaryRowId, diaryId, currentState);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["diaries", date] });
  //   },
  //   onError: (error) => {
  //     console.error("Error toggling isFetching_todo:", error);
  //   }
  // });

  // const handleFetchTodosToggle = (diaryRowId: string, diaryId: string, currentState: boolean) => {
  //   toggleIsFetchingMutation.mutate({ diaryRowId, diaryId, currentState });
  // };
  const extractPreviewContent = (htmlContent: string) => {
    const sanitizedContent = DOMPurify.sanitize(htmlContent);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = sanitizedContent;

    // 이미지 추출
    const images = Array.from(tempElement.querySelectorAll("img")).slice(0, MAX_IMAGES);

    // 텍스트 추출
    const paragraphs = Array.from(tempElement.querySelectorAll("p")).slice(0, isDesktop ? MAX_LINES + 3 : MAX_LINES);

    return (
      <>
        <ul className="flex justify-start gap-1 mobile:mt-2 desktop:mt-3.5">
          {images.map((img, index) => (
            <li key={nanoid()} className="w-1/3">
              <Image
                key={index}
                src={img.src}
                width={300}
                height={300}
                objectFit="cover"
                alt={`diary-image-${index}`}
                className="w-full h-full my-2 rounded-[20px] block"
              />
            </li>
          ))}
        </ul>
        <div className="mobile:mt-2 desktop:mt-3.5">
          {paragraphs.map((para, index) => (
            <p
              key={index}
              className={`font-sans overflow-hidden text-ellipsis`}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: MAX_LINES,
                overflow: "hidden"
              }}
            >
              {para.innerText}
            </p>
          ))}
        </div>
      </>
    );
  };
  if (!userId) {
    return (
      <>
        <div className="text-center text-bc2 h-8 py-7 text-fai-900">
          <p>{formatSelectedDate(date)}</p>
        </div>
        <div className="w-72 bg-system-white text-left rounded-l-[32px] rounded-t-[32px] rounded-br-[2px] text-system-white p-6 border border-fai-200 absolute right-[4.5rem] bottom-[8.5rem]">
          <p className="h-7 leading-7 text-lg text-fai-900 tracking-custom-letter-spacing font-bold">
            로그인후 확인할 수 있습니다.
          </p>
        </div>
        <AddFABtn
          onClick={handleAddContentClick}
          defaultClass="bg-fai-500"
          hoverClass="hover:bg-fai-500 hover:border-fai-700 hover:border-2"
          pressClass="active:bg-fai-700"
        />
        <Modal />
      </>
    );
  }
  if (isDiaryPending) {
    return (
      <div className="pt-8">
        {Array.from({ length: 2 }, (v, i) => i).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-4 w-[calc(100%-32px)] mx-auto mobile:rounded-[32px] desktop:rounded-[60px] desktop:px-6 desktop:pt-6 desktop:pb-7 animate-pulse animate-bounce mb-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full  mb-4 animate-pulse animate-shimmer"></div>
                <div className="w-48 h-6 bg-gray-300 rounded  mb-4 animate-pulse animate-shimmer"></div>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded-full mb-4 animate-pulse animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse animate-shimmer mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse animate-shimmer mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse animate-shimmer mb-4"></div>
          </div>
        ))}
      </div>
    );
  }
  if (!diaryData && diaryError) {
    return (
      <div className={`${isDesktop ? "" : "rounded-t-[3rem]"}`}>
        {isDesktop && (
          <div className="text-center text-bc2 h-8 py-7 text-fai-900">
            <p>{formatSelectedDate(date)}</p>
          </div>
        )}
        <div className="w-[calc(100%-32px)] mx-auto pt-10 flex justify-center items-center gap-3 box-border desktop:h-10 desktop:py-8 desktop:mt-10">
          <div className="h-7 w-7 relative">
            <DiaryIcon className="absolute left-1/2 top-1/2 translate -translate-x-1/2 -translate-y-1/2 desktop:h-10 desktop:w-10" />
          </div>
          <div className="mobile:h-6 ">
            <p className="mobile:text-b4 desktop:text-sh1 text-fai-500">작성된 일기가 없습니다.</p>
          </div>
        </div>
        <div
          className="bg-system-white text-left rounded-l-[32px] rounded-t-[32px] rounded-br-[2px] text-system-white mobile:p-6 desktop:p-7 border border-fai-200 fixed right-[4.5rem] bottom-[8.5rem] box-border"
          style={{ boxShadow: "0px 2px 6px rgba(255, 149, 36, 0.28)" }}
        >
          <p className="desktop:text-sh1 mobile:text-sh4  text-fai-900 font-bold mb-3">오늘 하루는 어떤 하루였나요?</p>
          <p className="mobile:text-bc5 desktop:text-bc3 text-gray-400 ">오늘 하루를 기록해보세요</p>
        </div>
        <AddFABtn
          onClick={handleAddContentClick}
          defaultClass="bg-fai-500"
          hoverClass="hover:bg-fai-500 hover:border-fai-700 hover:border-2"
          pressClass="active:bg-fai-700"
        />
        <Modal />
      </div>
    );
  }
  return (
    <div className="desktop:relative desktop:overflow-y-hidden desktop:h-full rounded-t-[48px]">
      <>
        {isDesktop && (
          <div className={` text-fai-900 ${isDesktop ? "text-b2 text-center py-7" : "text-center text-bc2 h-8 py-7"}`}>
            <p>{formatSelectedDate(date)}</p>
          </div>
        )}
        {/* {isDiaryPending && <div className="mt-20">{스켈레톤 혹은 다른 로딩 ui 추가 필요}</div>} */}
        {/* {diaryError && <div>Error</div>} */}
        {isDesktop && (
          <div
            className="w-full h-[80px] absolute pointer-events-none z-50 top-18"
            style={{ boxShadow: "inset 0px 20px 20px #FFECD8" }}
          ></div>
        )}
        {diaryData && (
          <div
            key={diaryData.diary_id}
            className={`w-full desktop:h-[89%] desktop:overflow-y-scroll relative mobile:h-full ${isDesktop ? "" : ""}`}
          >
            <ul
              key={diaryData.diary_id}
              className={`flex flex-col gap-4 overflow-x-hidden   ${isDesktop ? "desktop:absolute desktop:top-[20px] desktop:w-[calc(100%-2rem)] desktop:translate desktop:-translate-x-1/2 desktop:left-1/2" : "mobile:top-[-18px] w-full py-4"}`}
            >
              {diaryData?.content?.map((item, itemIndex) => {
                const diary = { diary_id: diaryData.diary_id, content: diaryData.content[itemIndex] };
                return (
                  <li
                    key={`${diaryData.diary_id}-${itemIndex}`}
                    className={`bg-system-white border border-fai-500 w-[calc(100%-2rem)] mx-auto ${itemIndex === diaryData.content.length - 1 ? "mb-[5rem]" : ""} cursor-pointer ${isDesktop ? "rounded-[3.75rem] px-6 pt-6 pb-7" : "rounded-[2rem] py-3 px-5 "}`}
                    onClick={() => handleEditClick(diaryData.diary_id, itemIndex)}
                  >
                    <div className={`flex justify-between items-center ${isDesktop ? "" : "h-11"}`}>
                      <div className="flex items-center gap-3">
                        <div className="mobile:p-2 desktop:p-3.5 rounded-full border-2 border-fai-500">
                          <DiaryIcon className="desktop:w-7 desktop:h-7" />
                        </div>
                        <div className="w-[10rem]">
                          <p className="desktop:text-3xl mobile:text-sh5 desktop:font-extrabold tracking-custom-letter-spacing truncate w-11/12">
                            {item.title}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`p-2 relative z-10 box-border ${isDesktop ? "border border-gray-200 rounded-full p-3.5" : ""}`}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                        }}
                      >
                        <DiaryDropDown
                          className="cursor-pointer desktop:w-7 desktop:h-7"
                          onClick={() => handleDropDownClick(`${diaryData.diary_id}-${itemIndex}`)}
                        />
                        <div
                          className={`absolute top-4  w-36 h-20 rounded-xl overflow-x-hidden transform ${
                            openDropDownIndex === `${diaryData.diary_id}-${itemIndex}`
                              ? "right-16 shadow-lg"
                              : "-right-36"
                          } transition-transform duration-300`}
                        >
                          {/* {openDropDownIndex === `${diaryRow.diary_id}-${itemIndex}` && ( */}
                          <ul
                            className={`absolute ${openDropDownIndex === `${diaryData.diary_id}-${itemIndex}` ? "right-0" : "right-[-120%]"} top-0 bg-system-white shadow-lg z-10  w-36 rounded-xl transition-all box-border`}
                          >
                            <li
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(diaryData.diary_id, itemIndex);
                              }}
                              className="cursor-pointer px-4 py-1 hover:bg-grayTrans-20032 border-b border-b-grayTrans-20060 flex items-center h-10 gap-3 active:bg-grayTrans-30080"
                            >
                              <div>
                                <DiaryEditIcon className="text-fai-500" />
                              </div>
                              <p className="text-fai-500 text-b5 font-medium">수정</p>
                            </li>
                            <li className="cursor-pointer px-4 py-1 hover:bg-grayTrans-20032  h-10 gap-3 relative active:bg-grayTrans-30080">
                              <div className="absolute top-1/2 translate -translate-y-1/2">
                                <DiaryDeleteIcon className="te text-system-error" />
                              </div>

                              <DiaryDeleteButton
                                targetDiary={diary.diary_id}
                                targetDiaryContentId={item.diary_id}
                                buttonStyle="w-full h-full absolute left-0"
                                textStyle="text-system-error text-b5 font-medium absolute top-[15px] translate -translate-y-1/2 -translate-x-1/2 left-[60px]"
                              />
                            </li>
                          </ul>
                          {/* )} */}
                        </div>
                      </div>
                    </div>
                    <div>{extractPreviewContent(item.content)}</div>
                    {/* 여기는 투두리스트 있는 다이어리인지 안니지를 판단하고 투두리스트를 뿌린다. */}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </>
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
