"use client";
import useChatSession from "@/hooks/useChatSession";
import { AIType } from "@/types/chat.session.type";

const aiTypeConfig = {
  assistant: {
    name: "PAi",
    tag: "@personal_assistant",
    description: "저와 채팅과 음성 인식 대화로\n함께 투두리스트를 만들어볼까요?"
  },
  friend: {
    name: "FAi",
    tag: "@your_friend",
    description: "AI 친구와 고민상담,\n고민과 생각을 대신 기록해 드릴게요"
  }
};

const SessionBtn = ({ aiType }: { aiType: AIType }) => {
  const { createSession } = useChatSession(aiType);
  const config = aiTypeConfig[aiType];

  const handleCreateSession = async () => {
    try {
      const session = await createSession(aiType);
    } catch (error) {
      console.error("Error creating session : ", error);
      // TODO : 에러 사용자 알림 추가
    }
  };

  return (
    <button
      onClick={handleCreateSession}
      className={`border-gray-100 bg-system-white border-4 flex px-4 py-5 rounded-[30px] ${config.name === "PAi" ? "hover:border-1 hover:border-solid hover:border-pai-400 active:bg-pai-400" : "hover:border-1 hover:border-solid hover:border-fai-500 active:bg-fai-500"}   `}
    >
      <div
        className={`rounded-full min-w-14 min-h-14 mr-4 ${config.name === "PAi" ? "bg-pai-200" : "bg-fai-200"}`}
      ></div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-xl font-medium">{config.name}</span>
        <span className="text-md font-normal">{config.tag}</span>
        <p className="text-gray-600 text-sm text-left leading-7 whitespace-pre-line tracking-widest mt-1 ">
          {config.description}
        </p>
      </div>
    </button>
  );
};

export default SessionBtn;
