"use client";
import useChatSession from "@/hooks/useChatSession";
import { v4 as uuidv4 } from "uuid";
import { AIType } from "@/types/chat.session.type";

const SessionBtn = ({ aiType }: { aiType: AIType }) => {
  const { createSession } = useChatSession(aiType);

  const aiTypeText = aiType === "assistant" ? "Assistant" : "Friend";
  return (
    <>
      <button onClick={() => createSession(aiType)}>New {aiTypeText} Chat</button>
    </>
  );
};

export default SessionBtn;
