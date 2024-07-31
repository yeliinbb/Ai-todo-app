import BoxIconCheck from "@/components/icons/BoxIconCheck";
import BoxIconListening from "@/components/icons/BoxIconListening";
import VoiceInteractionAnalyze from "@/components/icons/VoiceInteractionAnalyze";
import VoiceInteractionColor from "@/components/icons/VoiceInteractionColor";
import VoiceInteractionLine from "@/components/icons/VoiceInteractionLine";
import { useState, useEffect, useRef } from "react";

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

type RecognitionState = "default" | "ready" | "listening" | "processing" | "completed";

const SpeechText: React.FC<SpeechTextProps> = ({ onTranscript }) => {
  const [recognitionState, setRecognitionState] = useState<RecognitionState>("default");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.start = () => {
        setRecognitionState("listening");
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results.item(i);
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        if (finalTranscript) {
          setRecognitionState("processing");
          onTranscript(finalTranscript);
          setRecognitionState("completed");
        }
      };

      recognitionRef.current.onend = () => {
        setRecognitionState("default");
      };

      setRecognitionState("ready");
    }
  }, [onTranscript]);

  const toggleRecognition = () => {
    if (recognitionState === "listening" || recognitionState === "processing") {
      recognitionRef.current?.stop();
      setRecognitionState("default");
    } else {
      recognitionRef.current?.start();
      setRecognitionState("listening");
    }
  };

  const getIcon = () => {
    switch (recognitionState) {
      case "default":
        return <VoiceInteractionLine width={68} height={68} />;
      case "ready":
        return <VoiceInteractionColor width={68} height={68} />;
      case "listening":
        return <BoxIconListening width={68} height={68} />;
      case "processing":
        return <VoiceInteractionAnalyze width={68} height={68} />;
      case "completed":
        return <BoxIconCheck width={68} height={68} />;
    }
  };

  return (
    <button
      className="text-gray-600 bg-system-white bg-opacity-50 rounded-full min-w-[60px] min-h-[60px] flex items-center justify-center"
      onClick={toggleRecognition}
    >
      {getIcon()}
    </button>
  );
};

export default SpeechText;
