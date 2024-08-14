"use client";
import { summarizeAndUpdateSession } from "@/lib/utils/chat/summarizeAndUpdateSession";
import { AIType, MessageWithButton } from "@/types/chat.session.type";
import { useCallback, useLayoutEffect, useRef } from "react";

export default function useChatSummary(sessionId: string, messages: MessageWithButton[] | undefined, aiType: AIType) {
  const timerRef = useRef<number | null>(null);
  const isHiddenRef = useRef(false);
  const triggerSummary = useCallback(async () => {
    if (sessionId && messages && messages.length > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(async () => {
        try {
          await summarizeAndUpdateSession(sessionId, messages, aiType);
        } catch (error) {
          console.error("Failed to trigger summary : ", error);
        }
      }, 10000);
    }
  }, [sessionId, messages, aiType]);

  useLayoutEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isHiddenRef.current) {
        isHiddenRef.current = true;
        triggerSummary();
      } else if (!document.hidden) {
        isHiddenRef.current = false;
      }
    };
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [triggerSummary]);
  return { triggerSummary };
}
