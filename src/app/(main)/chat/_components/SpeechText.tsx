import { useState, useEffect, useRef } from "react";
import VoiceInteractionLine from "@/components/icons/VoiceInteractionLine";
import VoiceInteractionColor from "@/components/icons/VoiceInteractionColor";
import VoiceInteractionAnalyze from "@/components/icons/VoiceInteractionAnalyze";
import BoxIconCheck from "@/components/icons/BoxIconCheck";

interface SpeechTextProps {
  onTranscript: (transcript: string) => void;
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
  abort: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
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

const SpeechText: React.FC<SpeechTextProps> = ({ onTranscript }) => {
  const [status, setStatus] = useState<"default" | "listening" | "processing" | "completed">("default");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initializeSpeechRecognition = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = false; // 연속 인식 비활성화
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        setStatus("processing");
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results.item(i);
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript);
          setStatus("completed");
          recognitionRef.current?.stop();
        }
      };

      recognitionRef.current.onend = () => {
        if (status === "listening") {
          setStatus("default");
        }
      };
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (status === "listening" || status === "processing") {
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
      setStatus("default");
    } else if (status === "completed") {
      setStatus("default");
    } else {
      initializeSpeechRecognition(); // 새로운 인식 세션 시작 전 초기화
      recognitionRef.current?.start();
      setStatus("listening");
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
      className="bg-system-white text-gray-600 bg-opacity-50 rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center"
      onClick={toggleListening}
    >
      {renderIcon()}
    </button>
  );
};

export default SpeechText;
