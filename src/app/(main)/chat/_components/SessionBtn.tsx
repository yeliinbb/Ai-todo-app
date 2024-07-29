"use client";
import useChatSession from "@/hooks/useChatSession";
import { AIType } from "@/types/chat.session.type";

const SessionBtn = ({ aiType }: { aiType: AIType }) => {
  const { createSession } = useChatSession(aiType);

  const handleCreateSession = async () => {
    try {
      const session = await createSession(aiType);
    } catch (error) {
      console.error("Error creating session : ", error);
      // TODO : 에러 사용자 알림 추가
    }
  };

  const aiTypeText = aiType === "assistant" ? "Assistant" : "Friend";
  return (
    <>
      <button onClick={handleCreateSession}>New {aiTypeText} Chat</button>
    </>
  );
};

export default SessionBtn;
