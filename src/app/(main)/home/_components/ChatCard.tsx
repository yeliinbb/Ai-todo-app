"use client";

import Logo from "@/components/Logo";
import NextBtn from "@/components/icons/authIcons/NextBtn";
import NextLargeBtn from "@/components/icons/authIcons/NextLargeBtn";
import useCreateChatSession from "@/hooks/useCreateChatSession";
import { AIType } from "@/types/chat.session.type";
import ChatCharacter from "./ChatCharacter";
import LoadingSpinnerSmall from "@/components/LoadingSpinnerSmall";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type PropsType = {
  aiType: AIType;
};

const ChatCard = ({ aiType }: PropsType) => {
  // TODO: PAi 로고 변경
  const { handleCreateSession, openModal, Modal, isAnyButtonIsPending, activeAiType, userId } = useCreateChatSession();
  const router = useRouter();
  const isActive = activeAiType === aiType;
  const isFai = aiType === "friend";
  const logoType = isFai ? "fai" : "pai";

  return (
    <button
      className={`desktop:max-w-[35.625rem] desktop:h-[20.75rem] desktop:rounded-[40px] min-w-[168px] min-h-[204px] w-full h-auto flex justify-center items-center rounded-[32px] border-2 desktop:p-2  ${isFai ? "border-fai-300 bg-fai-400" : "border-pai-200 bg-pai-300"}`}
      disabled={isAnyButtonIsPending}
      onClick={() => handleCreateSession(aiType)}
    >
      <Modal />
      <div
        className={`px-[1.125rem] pt-3 pb-4 desktop:px-8 desktop:pt-8 desktop:pb-9 desktop:rounded-[36px] desktop:border-4 w-full h-full flex flex-col justify-center items-center rounded-[28px] border-2  ${isFai ? "border-fai-100 bg-fai-400" : "border-pai-100 bg-pai-300"}`}
      >
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col desktop:flex-row items-center gap-2 desktop:gap-8 w-full h-full">
            <ChatCharacter isFai={isFai} />
            <div className="desktop:items-start desktop:gap-3 flex flex-col items-center">
              {isFai ? (
                <>
                  <p className="desktop:min-w-[14rem] desktop:text-left desktop:text-[1.625rem] desktop:leading-7 desktop:tracking-[0.8px] desktop:font-medium text-bc5 text-system-white">
                    이야기를 듣고
                  </p>
                  <p className="desktop:min-w-[14rem] desktop:text-left desktop:text-[1.625rem] desktop:leading-7 desktop:tracking-[0.8px] desktop:font-medium text-bc5 text-system-white">
                    일기를 작성해드려요
                  </p>
                </>
              ) : (
                <>
                  <p className="desktop:min-w-[14rem] desktop:text-left desktop:text-[1.625rem] desktop:leading-7 desktop:tracking-[0.8px] desktop:font-medium text-bc5 text-system-white">
                    투두리스트를
                  </p>
                  <p className="desktop:min-w-[14rem] desktop:text-left desktop:text-[1.625rem] desktop:leading-7 desktop:tracking-[0.8px] desktop:font-medium text-bc5 text-system-white">
                    추천&작성해드려요
                  </p>
                </>
              )}
            </div>
          </div>

          {isAnyButtonIsPending && isActive ? (
            <>
              <LoadingSpinnerSmall />
            </>
          ) : (
            <div
              className={`w-full desktop:mt-8 min-w-[7.75rem] relative flex rounded-full bg-system-white hover:cursor-pointer ${isFai ? "text-fai-500" : "text-pai-400"}`}
            >
              <div className="flex items-center desktop:px-5 desktop:py-3 min-w-[5.25rem] w-full h-auto mr-1 px-3 py-1">
                <div className="flex items-center justify-center w-5 mr-[2px] h-[0.875rem] desktop:w-[2.5rem] desktop:h-[1.394rem] desktop:mr-2">
                  <Logo type={logoType} />
                </div>
                <p className="desktop:text-sh3 desktop:ml-1.5 ml-0.5 text-c1">와 채팅</p>
              </div>
              <div className="desktop:hidden block absolute top-1 right-1.5">
                <NextBtn />
              </div>
              <div className="desktop:block hidden absolute top-3.5 right-5">
                <NextLargeBtn />
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatCard;
