import { RefObject, useState, useEffect, useCallback } from "react";
import SpeechText from "./SpeechText";
import BoxIconBtn from "@/components/icons/BoxIconBtn";
import BoxIconSend from "@/components/icons/BoxIconSend";
import TypingEffect from "./TypingEffect";

interface ChatInputProps {
  textRef: RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => Promise<void>;
  isPending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ textRef, handleKeyDown, handleSendMessage, isPending }) => {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [resetSpeechText, setResetSpeechText] = useState(false);

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

  const handleTranscript = useCallback((transcript: string) => {
    setTypingText(transcript);
    setIsTypingEffect(true);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setIsTypingEffect(false);
    if (textRef.current) {
      textRef.current.value = typingText;
    }
    setInputValue(typingText);
  }, [typingText, textRef]);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;
    try {
      setIsSending(true);
      setInputValue("");
      await handleSendMessage();
      if (textRef.current) {
        textRef.current.value = "";
      }
      setResetSpeechText(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && inputValue.trim() !== "") {
      e.preventDefault();
      handleSend();
    } else {
      handleKeyDown(e);
    }
  };

  const handleResetComplete = () => {
    setResetSpeechText(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mb-4 max-w-[778px] mx-auto flex flex-row justify-between backdrop-blur-3xl bg-grayTrans-90020 p-1 w-full min-w-md rounded-full z-999 shadow-inner">
      <SpeechText
        onTranscript={handleTranscript}
        inputRef={textRef}
        reset={resetSpeechText}
        onResetComplete={handleResetComplete}
      />
      <div className="flex-grow ml-4 relative min-h-[40px] flex items-center">
        {isTypingEffect ? (
          <TypingEffect text={typingText} baseSpeed={50} onComplete={handleTypingComplete} />
        ) : (
          <input
            style={{ background: "transparent" }}
            className="placeholder-system-white outline-none border-none w-full mx-auto text-bc5 desktop:text-bc2"
            ref={textRef}
            type="text"
            onKeyDown={handleInputKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={isPending}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
      </div>
      <button
        className="rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center"
        onClick={handleSend}
        disabled={isPending || inputValue.trim() === ""}
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
