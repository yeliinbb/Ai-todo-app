import { formatTime } from "@/lib/utils/formatTime";
import React from "react";
import TypingEffect from "./TypingEffect";
import { Message } from "@/types/chat.session.type";
import CommonChatSystemButton from "@/components/icons/chat/CommonChatSystemButton";

interface FriendMessageItemProps {
  message: Message;
  isLatestAIMessage: boolean;
  isNewConversation: boolean; // 새로운 prop 추가
  showSaveDiaryButton: boolean;
  handleSaveDiary: () => Promise<void>;
}

const FriendMessageItem = React.memo(
  ({ message, isLatestAIMessage, isNewConversation, showSaveDiaryButton, handleSaveDiary }: FriendMessageItemProps) => {
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
              <div className="flex flex-col p-1 w-full">
                <div>
                  {message.role !== "user" && isLatestAIMessage && isNewConversation ? (
                    <TypingEffect text={message.content || ""} />
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
                {/* <button
                  onClick={handleSaveDiary}
                  className="bg-grayTrans-20060 backdrop-blur-3xl text-gray-600 w-full font-semibold mt-2 px-3 py-2 rounded-full"
                >
                  일기 저장하기
                  
                </button> */}
                <CommonChatSystemButton onClick={handleSaveDiary}>일기 저장하기</CommonChatSystemButton>
              </div>
            )}
          </li>
        )}
      </>
    );
  }
);

FriendMessageItem.displayName = "FriendMessageItem";
export default FriendMessageItem;
