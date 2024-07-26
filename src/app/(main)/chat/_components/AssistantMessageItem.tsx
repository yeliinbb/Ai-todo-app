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
    return (
      <>
        {message && (
          <li>
            {message.role === "assistant" ? <span>PAi</span> : null}
            <div
              className={`${
                message.role === "user" ? "bg-primary-400 text-white" : "bg-white text-black"
              } flex flex-col`}
            >
              <span className="whitespace-pre-wrap leading-5">{message.content ?? ""}</span>
              <span className={` text-xs ${message.role === "user" ? "text-white" : "text-gray-500"} `}>
                {formatTime(message.created_at)}
              </span>
              {message.showSaveButton && (
                <button onClick={handleSaveButton} disabled={saveTodoMutation.isPending} className="bg-[#C9C9C9]">
                  {saveTodoMutation.isPending ? "저장 중..." : "저장 하기"}
                </button>
              )}
            </div>
          </li>
        )}
      </>
    );
  }
);

export default AssistantMessageItem;
