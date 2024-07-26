import { formatTime } from "@/lib/utils/\bformatTime";
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
            <span className="whitespace-pre-wrap leading-5">{message.content ?? ""}</span>
            <span className="ml-1.5 text-xs text-gray-500">{formatTime(message.created_at)}</span>
            {message.showSaveButton && (
              <button onClick={handleSaveButton} disabled={saveTodoMutation.isPending}>
                {saveTodoMutation.isPending ? "저장 중..." : "저장 하기"}
              </button>
            )}
          </li>
        )}
      </>
    );
  }
);

export default AssistantMessageItem;
