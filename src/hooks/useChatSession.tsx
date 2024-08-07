"use client";
import { AIType, ChatSession } from "@/types/chat.session.type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useChatSession(aiType: AIType) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // aiType별 세션 전체 목록 가져올 때
  const fetchSessionsByType = useCallback(async (aiType: AIType) => {
    try {
      setIsLoading(true);
      const url = aiType ? `/api/sessions?aiType=${aiType}` : "/api/sessions";
      const response = await fetch(url);
      // console.log("response", response);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        return data;
      } else {
        throw new Error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error checking sessions", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionsByType(aiType);
  }, [fetchSessionsByType, aiType]);

  const createSession = async (aiType: AIType) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ aiType })
      });
      if (response.ok) {
        const newSession = await response.json();
        // console.log("newSession", newSession);
        setSessions((prev) => [...prev, newSession]);
        setCurrentSessionId(newSession.session_id);
        router.push(`/chat/${aiType}/${newSession.session_id}`);
      } else if (response.status === 401) {
        // 인증되지 않은 사용자일 경우
        toast.warn("인증되지 않은 사용자입니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      } else if (response.status === 429) {
        // 일일 제한 도달 시
        toast.warn("일일 채팅 생성 한도에 도달했습니다. 아쉽지만 내일 다시 시도해주세요!");
      } else {
        // 기타 오류 처리
        const errorData = await response.json();
        throw new Error(errorData.data || "Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session", error);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
      if (response.ok) {
        setSessions((prev) => prev.filter((session) => session.session_id !== sessionId));
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
          console.log("endSession");
          router.push("/chat");
        }
      } else {
        throw new Error("Failed to end session");
      }
    } catch (error) {
      console.error("Error ending session", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentSession = (sessionId: string) => {
    const session = sessions.find((session) => session.session_id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      router.push(`/chat/${session.ai_type}/${sessionId}`);
    }
  };

  return { sessions, currentSessionId, fetchSessionsByType, createSession, endSession, setCurrentSession, isLoading };
}
