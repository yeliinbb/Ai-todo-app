"use client";
import useChatSession from "@/hooks/useChatSession";
import { AIType } from "@/types/chat.session.type";

const aiTypeConfig = {
  assistant: {
    name: "Pai",
    tag: "@personal_assistant",
    description: "저와 채팅과 음성 인식 대화로 함께 투두리스트를 만들어볼까요?"
  },
  friend: {
    name: "FAi",
    tag: "@your_friend",
    description: "AI 친구와 고민상담, 고민과 생각을 대신 기록해 드릴게요"
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
    <button onClick={handleCreateSession}>
      <span>{config.name}</span>
      <span>{config.tag}</span>
      <p>{config.description}</p>
    </button>
  );
};

export default SessionBtn;
