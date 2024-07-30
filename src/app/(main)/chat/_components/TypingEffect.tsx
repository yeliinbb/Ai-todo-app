import React, { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  baseSpeed?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, baseSpeed = 50 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, getTypingDelay(text[currentIndex]));

      return () => clearTimeout(timer);
    }
  }, [text, currentIndex, baseSpeed]);

  const getTypingDelay = (char: string): number => {
    if (char === " ") return baseSpeed * 0.5;
    if (".!?".includes(char)) return baseSpeed * 3;
    if (",;:".includes(char)) return baseSpeed * 2;
    return baseSpeed;
  };

  const sanitizeText = (input: string): string => {
    return input
      .replace(/\s+/g, " ")
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1 ")
      .trim();
  };

  useEffect(() => {
    const sanitizedText = sanitizeText(text);
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayText}</span>;
};

export default TypingEffect;
