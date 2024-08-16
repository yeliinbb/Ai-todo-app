import React, { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  baseSpeed?: number;
  onComplete?: () => void;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, baseSpeed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, getTypingDelay(text[currentIndex]));

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [text, currentIndex, baseSpeed, onComplete]);

  const getTypingDelay = (char: string): number => {
    if (char === " ") return baseSpeed * 0.5;
    if (".!?".includes(char)) return baseSpeed * 3;
    if (",;:".includes(char)) return baseSpeed * 2;
    return baseSpeed;
  };

  useEffect(() => {
    const sanitizedText = sanitizeText(text);
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  const sanitizeText = (input: string): string => {
    return input
      .replace(/\s+/g, " ")
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1 ")
      .trim();
  };

  return <span className="whitespace-pre-wrap leading-6 tracking-wider">{displayText}</span>;
};

export default TypingEffect;
