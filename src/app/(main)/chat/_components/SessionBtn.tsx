"use client";
import Image from "next/image";
import useChatSession from "@/hooks/useChatSession";
import { useThrottle } from "@/hooks/useThrottle";
import { AIType } from "@/types/chat.session.type";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import LoadingSpinnerChat from "./LoadingSpinnerChat";

const aiTypeConfig = {
  assistant: {
    name: "PAi",
    tag: "@personal_assistant",
    description: "저와 채팅과 음성 인식 대화로\n투두리스트를 만들어볼까요?",
    image: "/Pai2.png",
    pendingImage: "/Disabled.PAi.png"
  },
  friend: {
    name: "FAi",
    tag: "@your_friend",
    description: "나랑 이야기해볼래?\n오늘 하루를 대신 기록해줄게!",
    image: "/Fai2.png",
    pendingImage: "/Disabled.FAi.png"
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
  const config = aiTypeConfig[aiType];
  const imageSrc = otherButtonPending ? config.pendingImage : config.image;

  return (
    <button
      disabled={isPending || otherButtonPending}
      onClick={() => handleCreateSession(aiType)}
      className={`bg-system-white border-4 flex px-5 py-7 rounded-[30px] w-full 
      desktop:flex-col desktop:justify-center desktop:items-center desktop:text-center desktop:w-full desktop:px-10 desktop:py-16 desktop:rounded-[68px]
      ${
        config.name === "PAi"
          ? "border-pai-100 hover:border-1 hover:border-solid hover:border-pai-400 active:bg-pai-400"
          : "border-fai-200 hover:border-1 hover:border-solid hover:border-fai-500 active:bg-fai-500"
      }`}
    >
      {isPending && isActive ? (
        <>
          <LoadingSpinnerChat aiType={aiType} />
        </>
      ) : (
        <>
          <div className={`min-w-14 min-h-14 mr-4 relative overflow-hidden desktop:w-48 desktop:h-48 desktop:mb-11`}>
            <Image src={imageSrc} alt={`${config.name} image`} layout="fill" objectFit="contain" />
          </div>
          <div className="flex flex-col gap-3 desktop:items-center desktop:gap-5">
            <div className="flex flex-col items-start desktop:gap-[0.625rem] desktop:items-center">
              <span className="text-h4 text-gray-900 desktop:text-h1">{config.name}</span>
              <span className="text-sh6 text-gray-900 desktop:text-sh1">{config.tag}</span>
            </div>
            <div className="flex flex-col items-start justify-center gap-1 desktop:items-center desktop:gap-2">
              {config.description.split("\n").map((line, index) => (
                <span
                  key={index}
                  className="text-gray-600 text-bc5-20 text-left whitespace-pre-line desktop:text-center desktop:text-bc3"
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
