import { RefObject, useState, useEffect } from "react";
import SpeechText from "./SpeechText";
import BoxIconSend from "@/components/icons/BoxIconSend";
import BoxIconBtn from "@/components/icons/BoxIconBtn";

interface ChatInputProps {
  textRef: RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => Promise<void>;
  isPending: boolean;
}

const ChatInput = ({ textRef, handleKeyDown, handleSendMessage, isPending }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");

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
    await handleSendMessage();
    setInputValue("");
    if (textRef.current) {
      textRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="fixed bottom-0 left-0 right-0 mb-4 flex flex-row justify-between backdrop-blur-3xl bg-grayTrans-60080 p-2 w-full min-w-md rounded-full z-999"
    >
      <SpeechText onTranscript={handleTranscript} />
      <input
        style={{ background: "transparent" }}
        className="placeholder-system-white outline-none border-none flex-grow mx-2"
        ref={textRef}
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={isPending}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center"
        disabled={isPending}
      >
        {isPending || inputValue.trim() !== "" ? (
          <BoxIconSend width={68} height={68} />
        ) : (
          <BoxIconBtn width={68} height={68} />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
