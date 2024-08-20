"use client";
import { AIType } from "@/types/chat.session.type";
import ChevronRight from "./icons/chat/ChevronRight";
import useCreateChatSession from "../hooks/useCreateChatSession";
interface ChatNavigateBtnInImageProps {
  aiType: AIType;
}

const aiTypeConfig = {
  assistant: {
    name: "PAi",
    textColor: "text-pai-400"
  },
  friend: {
    name: "FAi",
    textColor: "text-fai-500"
  }
};

const ChatNavigateBtnInImage = ({ aiType }: ChatNavigateBtnInImageProps) => {
  const config = aiTypeConfig[aiType];
  const { handleCreateSession, isAnyButtonIsPending } = useCreateChatSession();

  return (
    <button
      className={`text-sh4 pl-4 py-2 px-4 ml-1 flex items-center justify-center ${config.textColor}`}
      onClick={() => handleCreateSession(aiType)}
      disabled={isAnyButtonIsPending}
    >
      <span>{`${config.name}와 채팅하기`}</span>
      <span className="ml-2">
        <ChevronRight width={24} height={24} fill="currentColor" />
      </span>
    </button>
  );
};

export default ChatNavigateBtnInImage;
