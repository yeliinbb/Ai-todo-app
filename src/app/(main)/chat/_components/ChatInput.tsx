import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import { MutationContext } from "./AssistantChat";
import { RefObject } from "react";
import SpeechText from "./SpeechText";

interface ChatInputProps {
  textRef: RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => Promise<void>;
  sendMessageMutation: UseMutationResult<MessageWithSaveButton[], Error, string, MutationContext>;
}

const ChatInput = ({ textRef, handleKeyDown, handleSendMessage, sendMessageMutation }: ChatInputProps) => {
  //  스피치 투 텍스트 transcript
  const handleTranscript = (transcript: string) => {
    if (textRef.current) {
      textRef.current.value = transcript;
    }
  };
  return (
    <div className="flex flex-row justify-between bg-gray-500 bg-opacity-50 p-2 rounded-full">
      <SpeechText onTranscript={handleTranscript} />
      <input
        className="bg-gray-500 bg-opacity-0 placeholder-system-white outline-none border-none"
        ref={textRef}
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={sendMessageMutation.isPending}
      />
      <button
        className="text-system-black bg-system-white text-gray-600 bg-opacity-50 rounded-full min-w-[100px] min-h-[100px]"
        onClick={handleSendMessage}
        disabled={sendMessageMutation.isPending}
      >
        {sendMessageMutation.isPending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default ChatInput;
