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
    <div>
      <input
        ref={textRef}
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={sendMessageMutation.isPending}
      />
      <SpeechText onTranscript={handleTranscript} />
      <button onClick={handleSendMessage} disabled={sendMessageMutation.isPending}>
        {sendMessageMutation.isPending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default ChatInput;
