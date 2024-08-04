import { formatTime } from "@/lib/utils/formatTime";
import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import TypingEffect from "./TypingEffect";

interface FriendMessageItemProps {
  message: MessageWithSaveButton;
  handleSaveButton: () => void;
  saveDiaryMutation: UseMutationResult<any, Error, void, unknown>;
  isLatestAIMessage: boolean;
  isNewConversation: boolean; // 새로운 prop 추가
}

const FriendMessageItem = React.memo(
  ({ message, handleSaveButton, saveDiaryMutation, isLatestAIMessage, isNewConversation }: FriendMessageItemProps) => {
    const isUserMessage = message.role === "user";

    return (
      <>
        {message && (
          <li className={`mb-4 ${isUserMessage ? "text-right" : "text-left"}`}>
            {message.role === "friend" && <div className="text-sm font-bold text-gray-600 mb-1">FAi</div>}
            <div
              className={`inline-block p-2 rounded-lg ${
                isUserMessage ? "bg-fai-500 text-system-white" : "bg-system-white text-system-black"
              }`}
            >
              <div className="flex flex-col p-1 w-full max-w-80">
                <div>
                  {message.role !== "user" && isLatestAIMessage && isNewConversation ? (
                    <TypingEffect text={message.content || ""} />
                  ) : (
                    <span className="whitespace-pre-wrap leading-6 text-sm tracking-wider">
                      {message.content || ""}
                    </span>
                  )}
                </div>
                <div className="text-xs self-end mt-1">{formatTime(message.created_at)}</div>
              </div>
            </div>
            {message.showSaveButton && (
              <button
                onClick={handleSaveButton}
                disabled={saveDiaryMutation.isPending}
                className="bg-grayTrans-20060 backdrop-blur text-system-black mt-2 px-3 py-1 rounded-full w-full"
              >
                {saveDiaryMutation.isPending ? "저장 중..." : "저장 하기"}
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
