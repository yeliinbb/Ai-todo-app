import { formatTime } from "@/lib/utils/formatTime";
import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import TypingEffect from "./TypingEffect";

interface AssistantMessageItemProps {
  message: MessageWithSaveButton;
  handleSaveButton: () => void;
  saveTodoMutation: UseMutationResult<any, Error, void, unknown>;
  isLatestAIMessage: boolean;
  isNewConversation: boolean; // 새로운 prop 추가
}

const AssistantMessageItem = React.memo(
  ({
    message,
    handleSaveButton,
    saveTodoMutation,
    isLatestAIMessage,
    isNewConversation
  }: AssistantMessageItemProps) => {
    const isUserMessage = message.role === "user";

    return (
      <>
        {message && (
          <li className={`mb-4 ${isUserMessage ? "text-right" : "text-left"}`}>
            {message.role === "assistant" && <div className="text-sm mb-2">PAi</div>}
            <div
              className={`w-full p-2 flex flex-col ${isUserMessage
      ? "bg-pai-400 rounded-tl-3xl"
      : "bg-system-white rounded-tr-3xl"
  } rounded-b-3xl`}
            >
              <div className="flex flex-col p-1 w-full max-w-80">
                <div>
                  {message.role !== "user" && isLatestAIMessage && isNewConversation ? (
                    <TypingEffect text={message.content || ""} />
                  ) : (
                    <span
                      className={`whitespace-pre-wrap leading-6 text-sm tracking-wider ${isUserMessage ? "text-system-white" : " text-system-black"}`}
                    >
                      {message.content || ""}
                    </span>
                  )}
                </div>
                <div className={`text-xs self-end mt-1 ${isUserMessage ? "text-system-white" : " text-gray-600"}`}>
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
            {message.showSaveButton && (
              <button
                onClick={handleSaveButton}
                disabled={saveTodoMutation.isPending}
                className="bg-grayTrans-20060 backdrop-blur-xl text-gray-600 font-semibold mt-2 px-3 py-2 rounded-full w-full"
              >
                {saveTodoMutation.isPending ? "저장 중..." : "저장 하기"}
              </button>
            )}
          </li>
        )}
      </>
    );
  }
);

AssistantMessageItem.displayName = "AssistantMessageItem";
export default AssistantMessageItem;
