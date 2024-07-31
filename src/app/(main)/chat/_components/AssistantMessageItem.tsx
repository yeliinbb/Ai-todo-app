import { formatTime } from "@/lib/utils/formatTime";
import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";

interface AssistantMessageItemProps {
  message: MessageWithSaveButton;
  handleSaveButton: () => void;
  saveTodoMutation: UseMutationResult<any, Error, void, unknown>;
}

const AssistantMessageItem = React.memo(
  ({ message, handleSaveButton, saveTodoMutation }: AssistantMessageItemProps) => {
    const isUserMessage = message.role === "user";

    return (
      <>
        {message && (
          <>
            <li className={`mt-4 ${isUserMessage ? "text-right" : "text-left"}`}>
              {message.role === "assistant" ? <span className="text-sm mb-2">PAi</span> : null}
              <div
                className={`inline-block p-2 rounded-xl ${
                  isUserMessage ? "bg-pai-400 text-system-white" : "bg-system-white text-system-black"
                } flex flex-col`}
              >
                <span className="whitespace-pre-wrap leading-6 text-sm tracking-wider">{message.content ?? ""}</span>
                <span className={` text-xs self-end mt-1 ${isUserMessage ? "text-system-white" : "text-gray-500"} `}>
                  {formatTime(message.created_at)}
                </span>
              </div>
            </li>
            {message.showSaveButton && (
              <button
                onClick={handleSaveButton}
                disabled={saveTodoMutation.isPending}
                className="bg-grayTrans-20060 backdrop-blur text-system-black mt-2 px-3 py-1 rounded-full w-full"
              >
                {saveTodoMutation.isPending ? "저장 중..." : "저장 하기"}
              </button>
            )}
          </>
        )}
      </>
    );
  }
);

AssistantMessageItem.displayName = "AssistantMessageItem";
export default AssistantMessageItem;
