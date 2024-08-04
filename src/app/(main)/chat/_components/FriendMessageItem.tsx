import { formatTime } from "@/lib/utils/formatTime";
import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import TypingEffect from "./TypingEffect";

interface FriendMessageItemProps {
  message: MessageWithSaveButton;
  handleSaveButton: () => void;
  isPending: boolean;
  isLatestAIMessage: boolean;
  isNewConversation: boolean; // 새로운 prop 추가
}

const FriendMessageItem = React.memo(
  ({ message, handleSaveButton, isPending, isLatestAIMessage, isNewConversation }: FriendMessageItemProps) => {
    const isUserMessage = message.role === "user";

    return (
      <>
        {message && (
          <li className={`mb-4 ${isUserMessage ? "text-right" : "text-left"}`}>
            {message.role === "friend" && <div className="text-sm mb-2">FAi</div>}
            <div
              className={`w-full p-2 flex flex-col ${
                isUserMessage ? "bg-fai-500 rounded-tl-3xl" : "bg-system-white rounded-tr-3xl"
              } rounded-b-3xl`}
            >
              <div className="flex flex-col p-1 w-full max-w-80">
                <div>
                  {message.role !== "user" && isLatestAIMessage && isNewConversation ? (
                    <TypingEffect text={message.content || ""} />
                  ) : (
                    <span
                      className={`whitespace-pre-wrap leading-6 text-sm tracking-wider ${isUserMessage ? "text-system-white" : "text-system-black"}`}
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
                disabled={isPending}
                className="bg-grayTrans-20060 backdrop-blur-3xl text-gray-600 font-semibold mt-2 px-3 py-2 rounded-full w-full"
              >
                {isPending ? "저장 중..." : "저장 하기"}
              </button>
            )}
          </li>
        )}
      </>
    );
  }
);

FriendMessageItem.displayName = "FriendMessageItem";
export default FriendMessageItem;
