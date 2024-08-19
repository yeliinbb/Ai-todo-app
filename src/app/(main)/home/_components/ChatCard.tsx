"use client";

import Logo from "@/components/Logo";
import NextBtn from "@/components/icons/authIcons/NextBtn";
import NextLargeBtn from "@/components/icons/authIcons/NextLargeBtn";
import useCreateChatSession from "@/hooks/useCreateChatSession";
import { AIType } from "@/types/chat.session.type";
import ChatCharacter from "./ChatCharacter";
import LoadingSpinnerSmall from "@/components/LoadingSpinnerSmall";

type PropsType = {
  aiType: AIType;
};

const ChatCard = ({ aiType }: PropsType) => {
  // TODO: PAi 로고 변경
  const { handleCreateSession, Modal, isAnyButtonIsPending, activeAiType } = useCreateChatSession();
  const isActive = activeAiType === aiType;
  const isFai = aiType === "friend";
  const logoType = isFai ? "fai" : "pai";

  return (
    <button
      className={`desktop:w-[35.625rem] desktop:h-[20.75rem] desktop:rounded-[40px] min-w-[168px] min-h-[204px] w-full h-auto flex justify-center items-center rounded-[32px] border-2  ${isFai ? "border-fai-300 bg-fai-400" : "border-pai-200 bg-pai-300"}`}
      disabled={isAnyButtonIsPending}
      onClick={() => handleCreateSession(aiType)}
    >
      <Modal />
      <div
        className={`desktop:w-[calc(100%-13px)] desktop:h-[19.75rem] desktop:rounded-[36px] desktop:border-4 min-w-[160px] min-h-[196px] w-[calc(100%-4px)] h-auto flex flex-col justify-center items-center rounded-[28px] border-2  ${isFai ? "border-fai-100 bg-fai-400" : "border-pai-100 bg-pai-300"}`}
      >
        <div className="desktop:flex-row flex flex-col items-center">
          <ChatCharacter isFai={isFai} />
          <div className="desktop:items-start desktop:ml-8 desktop:mt-5 flex flex-col items-center mt-[0.5rem] mb-4 ">
            <p className="desktop:w-[18.625rem] desktop:text-bc5 text-bc5 text-system-white">투두리스트를</p>
            <p className="desktop:w-[18.625rem] desktop:text-bc5 text-bc5 text-system-white">추천&작성해드려요</p>
          </div>
        </div>
        {isAnyButtonIsPending && isActive ? (
          <>
            <LoadingSpinnerSmall />
          </>
        ) : (
          <div
            className={`desktop:w-[calc(100%-50px)] desktop:mt-8 min-w-[7.75rem] w-[calc(100%-32px)] relative flex rounded-full bg-system-white hover:cursor-pointer ${isFai ? "text-fai-500" : "text-pai-400"}`}
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
    </button>
  );
};

export default ChatCard;
