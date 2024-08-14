import { formatTime } from "@/lib/utils/formatTime";
import React, { useEffect, useRef } from "react";
import TypingEffect from "./TypingEffect";
import { Message } from "@/types/chat.session.type";
import CommonChatSystemButton from "@/components/icons/chat/CommonChatSystemButton";

interface FriendMessageItemProps {
  message: Message;
  isLatestAIMessage: boolean;
  isNewConversation: boolean;
  showSaveDiaryButton: boolean;
  handleSaveDiary: () => Promise<void>;
}

const FriendMessageItem = React.memo(
  ({ message, isLatestAIMessage, isNewConversation, showSaveDiaryButton, handleSaveDiary }: FriendMessageItemProps) => {
    const isUserMessage = message.role === "user";
    const messageRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
      if (messageRef.current && isLatestAIMessage) {
        messageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [isLatestAIMessage, message.content]);

    return (
      <li ref={messageRef} className="mb-4 text-left">
        {message && (
          <>
            {message.role === "friend" && <div className="text-sm mb-2">FAi</div>}
            <div
              className={`w-full p-2 flex flex-col ${
                isUserMessage ? "bg-fai-500 rounded-tl-2xl" : "bg-system-white rounded-tr-2xl"
              } rounded-b-2xl`}
            >
              <div className="flex flex-col p-1 w-full">
                <div>
                  {message.role !== "user" && isLatestAIMessage && isNewConversation ? (
                    <TypingEffect
                      text={message.content || ""}
                      onComplete={() => {
                        if (messageRef.current) {
                          messageRef.current.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    />
                  ) : (
                    <span
                      className={`whitespace-pre-wrap leading-6 text-sm font-normal tracking-wider ${isUserMessage ? "text-system-white" : "text-system-black"}`}
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
            {showSaveDiaryButton && isLatestAIMessage && (
              <div className="flex gap-2 mt-[10px]">
                <CommonChatSystemButton onClick={handleSaveDiary}>일기 저장하기</CommonChatSystemButton>
              </div>
            )}
          </>
        )}
      </li>
    );
  }
);

FriendMessageItem.displayName = "FriendMessageItem";
export default FriendMessageItem;
