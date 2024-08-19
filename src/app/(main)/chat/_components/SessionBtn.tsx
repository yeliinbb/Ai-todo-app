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
    image: "/Pai2.png"
  },
  friend: {
    name: "FAi",
    tag: "@your_friend",
    description: "나랑 이야기해볼래?\n오늘 하루를 대신 기록해줄게!",
    image: "/Fai2.png"
  }
};

interface SessionBtnProps {
  aiType: AIType;
  handleCreateSession: (aiType: AIType) => Promise<void>;
  isPending: boolean;
  isActive: boolean;
}

const SessionBtn = ({ aiType, handleCreateSession, isPending, isActive }: SessionBtnProps) => {
  // const { createSession, isCreateSessionPending : isPending } = useChatSession(aiType);
  const config = aiTypeConfig[aiType];
  // const router = useRouter();
  // const throttle = useThrottle();

  // const handleCreateSession = useCallback(() => {
  //   throttle(async () => {
  //     try {
  //       const result = await createSession(aiType);
  //       if (result?.success) {
  //         router.push(`/chat/${aiType}/${result.session.session_id}`);
  //       } else if (result?.error === "unauthorized") {
  //         handleUnauthorized();
  //       }
  //     } catch (error) {
  //       console.error("Error creating session : ", error);
  //       // TODO : 에러 사용자 알림 추가
  //     }
  //   }, 1000);
  // }, [throttle, aiType, createSession, router, handleUnauthorized]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleCreateSession(aiType);
  };

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className={`bg-system-white border-4 flex px-5 py-7 rounded-[30px] w-full 
      desktop:flex-col desktop:justify-center desktop:items-center desktop:text-center desktop:w-full desktop:max-w-[35.625rem] desktop:h-[32.25rem]
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
          <div
            className={`min-w-14 min-h-14 mr-4 relative overflow-hidden desktop:w-full desktop:w-[12.5rem] desktop:h-[12.5rem] desktop:mb-[2.75rem]`}
          >
            <Image src={config.image} alt={`${config.name} image`} layout="fill" objectFit="contain" />
          </div>
          <div className="flex flex-col items-start gap-1 desktop:items-center">
            <span className="text-h4 text-gray-900 desktop:text-[1.875rem] desktop:mb-[0.625rem]">{config.name}</span>
            <span className="text-sh6 text-gray-900 desktop:text-[1.5rem] desktop:mb-[1.18rem] ">{config.tag}</span>
            <div className="flex flex-col items-start justify-center gap-1 mt-1 desktop:items-center">
              {config.description.split("\n").map((line, index) => (
                <span
                  key={index}
                  className="text-gray-600 text-bc5-20 text-left whitespace-pre-line desktop:text-[1.125rem] desktop:text-center"
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
