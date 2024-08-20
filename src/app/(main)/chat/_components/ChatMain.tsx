"use client";
import useCreateChatSession from "@/hooks/useCreateChatSession";
import React from "react";
import SessionBtn from "./SessionBtn";
import { AI_TYPES } from "@/lib/constants/aiTypes";

const ChatMain = () => {
  const { handleCreateSession, Modal, isAnyButtonIsPending, activeAiType } = useCreateChatSession();

  return (
    <>
      <Modal />
      <div className="pt-[4.5rem] desktop:pt-[5.375rem] bg-gray-100 mobile:h-[100dvh] desktop:h-screen desktop:overflow-y-auto">
        <div className="gradient-container w-full h-full border-solid border-2 border-grayTrans-30080 border-b-0 rounded-t-[60px] desktop:border-4 desktop:border-b-0">
          <div className="gradient-rotated gradient-ellipse w-full h-[90%]"></div>
          <div className="relative z-10 w-full h-full">
            <div className="flex flex-col items-center w-full h-full">
              <span className="text-gray-600 text-sh4 mt-12 mb-8 desktop:my-20 desktop:text-h1">
                어떤 파이와 이야기해 볼까요?
              </span>
              {/* 모바일 레이아웃 */}
              <div className="flex flex-col px-4 gap-8 w-full desktop:hidden">
                {AI_TYPES.map((aiType) => (
                  <SessionBtn
                    key={aiType}
                    aiType={aiType}
                    handleCreateSession={handleCreateSession}
                    isPending={isAnyButtonIsPending}
                    isActive={activeAiType === aiType}
                    otherButtonPending={isAnyButtonIsPending && activeAiType !== aiType}
                  />
                ))}
              </div>

              {/* 데스크톱 레이아웃 */}
              <div className="hidden desktop:flex px-[3.25rem] gap-10 w-full justify-center">
                {AI_TYPES.map((aiType) => (
                  <SessionBtn
                    key={aiType}
                    aiType={aiType}
                    handleCreateSession={handleCreateSession}
                    isPending={isAnyButtonIsPending}
                    isActive={activeAiType === aiType}
                    otherButtonPending={isAnyButtonIsPending && activeAiType !== aiType}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMain;
