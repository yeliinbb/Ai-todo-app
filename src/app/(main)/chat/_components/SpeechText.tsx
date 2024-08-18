import BoxIconCheck from "@/components/icons/BoxIconCheck";
import VoiceInteractionAnalyze from "@/components/icons/VoiceInteractionAnalyze";
import VoiceInteractionColor from "@/components/icons/VoiceInteractionColor";
import VoiceInteractionLine from "@/components/icons/VoiceInteractionLine";
import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechTextProps {
  onTranscript: (transcript: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  reset: boolean;
  onResetComplete: () => void;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const SpeechText: React.FC<SpeechTextProps> = ({ onTranscript, inputRef }) => {
  const [status, setStatus] = useState<"default" | "listening" | "processing" | "completed">("default");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const resetToDefault = useCallback(() => {
    setStatus("default");
  }, []);

  useEffect(() => {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "ko-KR"; // 한국어 설정

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        setStatus("processing");
        const result = event.results[0];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          onTranscript(transcript);
          setStatus("completed");
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = window.setTimeout(resetToDefault, 1500);
        }
      };

      recognitionRef.current.onend = () => {
        if (status === "listening") {
          setStatus("default");
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setStatus("default");
      };
    } else {
      console.error("SpeechRecognition is not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscript, resetToDefault, status]);

  useEffect(() => {
    if (status === "completed") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(resetToDefault, 1500);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [status, resetToDefault]);

  const toggleListening = () => {
    if (status === "default") {
      try {
        recognitionRef.current?.start();
        setStatus("listening");
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setStatus("default");
      }
    } else if (status === "listening") {
      recognitionRef.current?.stop();
      setStatus("default");
    }
  };

  const renderIcon = () => {
    switch (status) {
      case "default":
        return <VoiceInteractionLine width={68} height={68} />;
      case "listening":
        return <VoiceInteractionColor width={68} height={68} />;
      case "processing":
        return <VoiceInteractionAnalyze width={68} height={68} />;
      case "completed":
        return <BoxIconCheck width={68} height={68} />;
    }
  };

  return (
    <button
      className="bg-system-white text-gray-600 bg-opacity-50 rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center touch-manipulation"
      onClick={toggleListening}
      disabled={status === "processing" || status === "completed"}
    >
      {renderIcon()}
    </button>
  );
};

export default SpeechText;
