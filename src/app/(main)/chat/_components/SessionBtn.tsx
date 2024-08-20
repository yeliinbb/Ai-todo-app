"use client";
import Image from "next/image";
import useChatSession from "@/hooks/useChatSession";
import { useThrottle } from "@/hooks/useThrottle";
import { AIType } from "@/types/chat.session.type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinnerChat from "./LoadingSpinnerChat";

const aiTypeConfig = {
  assistant: {
    name: "PAi",
    tag: "@personal_assistant",
    description: "저와 채팅과 음성 인식 대화로\n투두리스트를 만들어볼까요?",
    image: "/Pai2.png",
    pendingImage: "/Disabled.PAi.png",
    activeColor: "border-pai-100",
    hoverColor: "hover:border-pai-400",
    activeBackground: "active:bg-pai-400"
  },
  friend: {
    name: "FAi",
    tag: "@your_friend",
    description: "나랑 이야기해볼래?\n오늘 하루를 대신 기록해줄게!",
    image: "/Fai2.png",
    pendingImage: "/Disabled.FAi.png",
    activeColor: "border-fai-200",
    hoverColor: "hover:border-fai-500",
    activeBackground: "active:bg-fai-500"
  }
};

interface SessionBtnProps {
  aiType: AIType;
  handleCreateSession: (aiType: AIType) => Promise<void>;
  isPending: boolean;
  isActive: boolean;
  otherButtonPending: boolean;
}

const SessionBtn = ({ aiType, handleCreateSession, isPending, isActive, otherButtonPending }: SessionBtnProps) => {
  const [isLoadingDone, setIsLoadingDone] = useState(false);
  const config = aiTypeConfig[aiType];
  const imageSrc = otherButtonPending ? config.pendingImage : config.image;

  const isDisabled = otherButtonPending && !isActive;
  const buttonStyle = isDisabled
    ? "bg-gray-200 bg-grayTrans-30080 border-gray-100"
    : `bg-system-white ${config.activeColor} ${config.hoverColor} ${config.activeBackground}`;

  const textColor = isDisabled ? "text-gray-400" : "text-gray-900";

  useEffect(() => {
    if (isPending && isActive) {
      setIsLoadingDone(true);
    }
  }, [isPending, isActive]);

  return (
    <button
      disabled={isDisabled}
      onClick={() => handleCreateSession(aiType)}
      className={`bg-system-white border-4 flex px-5 py-7 rounded-[30px] w-full 
      desktop:flex-col desktop:justify-center desktop:items-center desktop:text-center desktop:w-full desktop:px-10 desktop:py-16 desktop:rounded-[68px]
      ${buttonStyle} transition-colors duration-300`}
    >
      {(isPending && isActive) || isLoadingDone ? (
        <LoadingSpinnerChat aiType={aiType} />
      ) : (
        <>
          <div className={`min-w-14 min-h-14 mr-4 relative overflow-hidden desktop:w-48 desktop:h-48 desktop:mb-11`}>
            <Image src={imageSrc} alt={`${config.name} image`} layout="fill" objectFit="contain" />
          </div>
          <div className="flex flex-col gap-3 desktop:items-center desktop:gap-5">
            <div className="flex flex-col items-start desktop:gap-[0.625rem] desktop:items-center">
              <span className={`text-h4 ${textColor} desktop:text-h1`}>{config.name}</span>
              <span className={`text-sh6 ${textColor} desktop:text-sh1`}>{config.tag}</span>
            </div>
            <div className="flex flex-col items-start justify-center gap-1 desktop:items-center desktop:gap-2">
              {config.description.split("\n").map((line, index) => (
                <span
                  key={index}
                  className={`${isDisabled ? "text-gray-400" : "text-gray-600"} text-bc5-20 text-left whitespace-pre-line desktop:text-center desktop:text-bc3`}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </button>
  );
};

export default SessionBtn;
