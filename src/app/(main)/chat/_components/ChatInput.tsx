import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import { MutationContext } from "./AssistantChat";
import { RefObject, useState, useEffect } from "react";
import SpeechText from "./SpeechText";
import BoxIconBtn from "@/components/BoxIconBtn";
import BoxIconSend from "@/components/BoxIconSend";

interface ChatInputProps {
  textRef: RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => Promise<void>;
  sendMessageMutation: UseMutationResult<MessageWithSaveButton[], Error, string, MutationContext>;
}

const ChatInput = ({ textRef, handleKeyDown, handleSendMessage, sendMessageMutation }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");

  // 입력 값 변경 감지
  useEffect(() => {
    const handleInputChange = () => {
      if (textRef.current) {
        setInputValue(textRef.current.value);
      }
    };

    if (textRef.current) {
      textRef.current.addEventListener("input", handleInputChange);
    }

    return () => {
      if (textRef.current) {
        textRef.current.removeEventListener("input", handleInputChange);
      }
    };
  }, [textRef]);

  // 스피치 투 텍스트 transcript
  const handleTranscript = (transcript: string) => {
    if (textRef.current) {
      textRef.current.value = transcript;
      setInputValue(transcript);
    }
  };

  return (
    <div className="flex flex-row justify-between backdrop-blur-md bg-grayTrans-60080 p-2 w-full max-w-md rounded-full">
      <SpeechText onTranscript={handleTranscript} />
      <input
        style={{ background: "transparent" }}
        className="placeholder-system-white outline-none border-none"
        ref={textRef}
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={sendMessageMutation.isPending}
      />
      <button
        className="rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center"
        onClick={handleSendMessage}
        disabled={sendMessageMutation.isPending}
      >
        {sendMessageMutation.isPending || inputValue.trim() !== "" ? <BoxIconSend /> : <BoxIconBtn />}
      </button>
    </div>
  );
};

export default ChatInput;
