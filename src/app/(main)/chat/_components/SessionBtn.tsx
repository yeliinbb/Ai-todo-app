"use client";
import Image from "next/image";
import useChatSession from "@/hooks/useChatSession";
import { useThrottle } from "@/hooks/useThrottle";
import { AIType } from "@/types/chat.session.type";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const aiTypeConfig = {
  assistant: {
    name: "PAi",
    tag: "@personal_assistant",
    description: "저와 채팅과 음성 인식 대화로\n투두리스트를 만들어볼까요?",
    image: "/Pai.png",
    borderColor: "border-pai-200"
  },
  friend: {
    name: "FAi",
    tag: "@your_friend",
    description: "나랑 이야기해볼래?\n오늘 하루를 대신 기록해줄게!",
    image: "/Fai.png",
    borderColor: "border-fai-200"
  }
};

interface SessionBtnProps {
  aiType: AIType;
  handleUnauthorized: () => void;
}

const SessionBtn = ({ aiType, handleUnauthorized }: SessionBtnProps) => {
  const { createSession } = useChatSession(aiType);
  const config = aiTypeConfig[aiType];
  const router = useRouter();
  const throttle = useThrottle();

  const handleCreateSession = useCallback(() => {
    throttle(async () => {
      try {
        const result = await createSession(aiType);
        if (result?.success) {
          router.push(`/chat/${aiType}/${result.session.session_id}`);
        } else if (result?.error === "unauthorized") {
          handleUnauthorized();
        }
      } catch (error) {
        console.error("Error creating session : ", error);
        // TODO : 에러 사용자 알림 추가
      }
    }, 1000);
  }, [throttle, aiType, createSession, router, handleUnauthorized]);

  return (
    <button
      onClick={handleCreateSession}
      className={`bg-system-white border-4 flex px-5 py-7 rounded-[30px] ${
        config.name === "PAi"
          ? "border-pai-100 hover:border-1 hover:border-solid hover:border-pai-400 active:bg-pai-400"
          : "border-fai-200 hover:border-1 hover:border-solid hover:border-fai-500 active:bg-fai-500"
      }`}
    >
      <div className={`rounded-full min-w-14 min-h-14 mr-4 relative overflow-hidden border-2 ${config.borderColor}`}>
        <Image src={config.image} alt={`${config.name} image`} width={64} height={64} />
      </div>
      <div className="flex flex-col items-start gap-1 ">
        <span className="text-h4 text-gray-900">{config.name}</span>
        <span className="text-sh6 text-gray-900">{config.tag}</span>
        <div className="flex flex-col items-start justify-center gap-1 mt-1">
          {config.description.split("\n").map((line, index) => (
            <span key={index} className="text-gray-600 text-bc5-20 text-left whitespace-pre-line ">
              {line}
            </span>
          ))}
        </div>
        {/* <p className="text-gray-600 text-bc5-20 text-left whitespace-pre-line mt-1">{config.description}</p> */}
      </div>
    </button>
  );
};

export default SessionBtn;
