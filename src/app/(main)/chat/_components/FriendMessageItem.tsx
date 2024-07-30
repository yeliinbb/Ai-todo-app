import { formatTime } from "@/lib/utils/formatTime";
import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import TypingEffect from "./TypingEffect";

interface FriendMessageItemProps {
  message: MessageWithSaveButton;
  handleSaveButton: () => void;
  saveDiaryMutation: UseMutationResult<any, Error, void, unknown>;
}

const FriendMessageItem = React.memo(({ message, handleSaveButton, saveDiaryMutation }: FriendMessageItemProps) => {
  const isUserMessage = message.role === "user";

  return (
    <>
      {message && (
        <li className={`mb-4 ${isUserMessage ? "text-right" : "text-left"}`}>
          {message.role === "friend" && <div className="text-sm font-bold text-gray-600 mb-1">FAI</div>}
          <div
            className={`inline-block p-2 rounded-lg ${
              isUserMessage ? "bg-fai-500 text-system-black" : "bg-system-white text-system-black"
            }`}
          >
            <div className="flex flex-col p-1">
              <div>
                {message.role === "friend" ? (
                  <TypingEffect text={message.content || ""} />
                ) : (
                  <span>{message.content || ""}</span>
                )}
              </div>
              <div className="text-xs text-gray-500 self-end mt-1">{formatTime(message.created_at)}</div>
            </div>
          </div>
          {message.showSaveButton && (
            <button
              onClick={handleSaveButton}
              disabled={saveDiaryMutation.isPending}
              className="bg-[#C9C9C9] text-system-black mt-2 px-3 py-1 rounded"
            >
              {saveDiaryMutation.isPending ? "저장 중..." : "저장 하기"}
            </button>
          )}
        </li>
      )}
    </>
  );
});

FriendMessageItem.displayName = "FriendMessageItem";
export default FriendMessageItem;
