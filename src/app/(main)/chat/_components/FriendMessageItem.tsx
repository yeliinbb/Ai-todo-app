import { formatTime } from "@/lib/utils/formatTime";
import React from "react";
import TypingEffect from "./TypingEffect";
import { Message } from "@/types/chat.session.type";
import CommonChatSystemButton from "@/components/icons/chat/CommonChatSystemButton";
import Image from "next/image";

const FAiIcon = () => (
  <div className="w-6 h-6 relative rounded-full bg-system-white border-solid border-[1px] border-fai-200">
    <Image src="/Fai.png" alt="FAi Icon" layout="fill" objectFit="contain" />
  </div>
);

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
          <li className="mb-4 text-left desktop:mb-6">
            {!isUserMessage && (
              <div className="flex items-center mb-2">
                <div className="hidden desktop:block mr-2">
                  <FAiIcon />
                </div>
                <div className="text-bc5-20 desktop:text-h4">FAi</div>
              </div>
            )}
            <div
              className={`w-full p-2 flex flex-col ${
                isUserMessage ? "bg-fai-500 rounded-tl-2xl" : "bg-system-white rounded-tr-2xl"
              } rounded-b-2xl`}
            >
              <div className="flex flex-col p-1 w-full">
                <div>
                  <span
                    className={`whitespace-pre-wrap text-bc5 text-gray-900 desktop:text-b3 ${isUserMessage ? "text-system-white" : "text-system-black"}`}
                  >
                    {message.content || ""}
                  </span>
                </div>
                <div
                  className={`text-bc7 self-end mt-1 desktop:text-sh6 ${isUserMessage ? "text-system-white" : " text-gray-600"}`}
                >
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
            {showSaveDiaryButton && isLatestAIMessage && (
              <div className="flex gap-2 mt-[10px]">
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
