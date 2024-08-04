import { MessageWithSaveButton } from "@/types/chat.session.type";
import { UseMutationResult } from "@tanstack/react-query";
import { MutationContext, ServerResponse } from "./AssistantChat";
import { RefObject, useState, useEffect } from "react";
import SpeechText from "./SpeechText";
import BoxIconBtn from "@/components/icons/BoxIconBtn";
import BoxIconSend from "@/components/icons/BoxIconSend";

interface ChatInputProps {
  textRef: RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => Promise<void>;
  isPending: boolean;
}

const ChatInput = ({ textRef, handleKeyDown, handleSendMessage, isPending }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handleInputChange = () => {
      if (textRef.current) {
        setInputValue(textRef.current.value);
      }
    };

    const currentTextRef = textRef.current;

    if (currentTextRef) {
      currentTextRef.addEventListener("input", handleInputChange);
    }

    return () => {
      if (currentTextRef) {
        currentTextRef.removeEventListener("input", handleInputChange);
      }
    };
  }, [textRef]);

  const handleTranscript = (transcript: string) => {
    if (textRef.current) {
      textRef.current.value = transcript;
      setInputValue(transcript);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    await handleSendMessage();
    setInputValue("");
    setIsSending(false);
    if (textRef.current) {
      textRef.current.value = "";
    }
  };

  // 폼 이벤트로 변경해서 엔터 칠 경우에 마이크로 포커스 가는게 아니라 전송 버튼이 눌리도록 수정 필요 (폼 태그로 바꿀 경우에 그게 가능할지 확인 필요.)
  return (
    <div className="flex flex-row justify-between backdrop-blur-md bg-grayTrans-60080 p-2 w-full max-w-md rounded-full">
      <SpeechText onTranscript={handleTranscript} />
      <input
        style={{ background: "transparent" }}
        className="placeholder-system-white outline-none border-none"
        ref={textRef}
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            handleSend();
          } else {
            handleKeyDown(e);
          }
        }}
        placeholder="메시지를 입력하세요..."
        disabled={isPending}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center"
        onClick={handleSend}
        disabled={isPending}
      >
        {isPending || inputValue.trim() !== "" ? (
          <BoxIconSend width={68} height={68} />
        ) : (
          <BoxIconBtn width={68} height={68} />
        )}
      </button>
    </div>
  );
};

export default ChatInput;
