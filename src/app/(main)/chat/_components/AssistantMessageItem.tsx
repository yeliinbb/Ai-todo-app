import { formatTime } from "@/lib/utils/formatTime";
import { MessageWithButton } from "@/types/chat.session.type";
import React from "react";
import TypingEffect from "./TypingEffect";
import { ChatTodoMode } from "./AssistantChat";
import CommonChatSystemButton from "@/components/icons/chat/CommonChatSystemButton";

interface AssistantMessageItemProps {
  message: MessageWithButton;
  handleSaveButton: () => void;
  isPending: boolean;
  isLatestAIMessage: boolean;
  isNewConversation: boolean;
  handleResetButton: () => void;
  todoMode: ChatTodoMode;
}

const AssistantMessageItem = React.memo(
  ({
    message,
    handleSaveButton,
    isPending,
    isLatestAIMessage,
    isNewConversation,
    handleResetButton,
    todoMode
  }: AssistantMessageItemProps) => {
    const isUserMessage = message.role === "user";
    const isResetButton = todoMode !== "resetTodo";
    return (
      <>
        {message && (
          <li className={`mb-4 ${isUserMessage ? "text-right" : "text-left"}`}>
            {message.role === "assistant" && <div className="text-sm mb-2">PAi</div>}
            <div
              className={`w-full p-2 flex flex-col ${
                isUserMessage ? "bg-pai-400 rounded-tl-3xl" : "bg-system-white rounded-tr-3xl"
              } rounded-b-3xl`}
            >
              <div className="flex flex-col p-1 w-full">
                <div>
                  {/* {message.role !== "user" && isLatestAIMessage && isNewConversation ? (
                    <TypingEffect text={message.content || ""} />
                  ) : (
                    <span
                      className={`whitespace-pre-wrap leading-6 text-sm tracking-wider ${isUserMessage ? "text-system-white" : "text-system-black"}`}
                    >
                      {message.content || ""}
                    </span>
                  )} */}
                  <span
                    className={`whitespace-pre-wrap leading-6 text-sm font-normal tracking-wider ${isUserMessage ? "text-system-white" : "text-system-black"}`}
                  >
                    {message.content || ""}
                  </span>
                </div>
                <div className={`text-xs self-end mt-1 ${isUserMessage ? "text-system-white" : " text-gray-600"}`}>
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
            {message.showSaveButton && (
              <div className="flex gap-2 mt-[10px]">
                {isResetButton && (
                  <>
                    <CommonChatSystemButton onClick={handleResetButton}>초기화 하기</CommonChatSystemButton>
                    <CommonChatSystemButton onClick={handleSaveButton}>저장 하기</CommonChatSystemButton>
                  </>
                )}
              </div>
            )}
          </li>
        )}
      </>
    );
  }
);

AssistantMessageItem.displayName = "AssistantMessageItem";
export default AssistantMessageItem;
