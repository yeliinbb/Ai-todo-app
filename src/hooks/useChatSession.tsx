"use client";

import { AIType, ChatSession } from "@/types/chat.session.type";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type PageData = {
  data: ChatSession[];
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
  currentPage: number;
};

const ITEMS_PER_PAGE = 6; // 한 페이지당 6개의 항목

export default function useChatSession(aiType: AIType) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, error, isSuccess } = useInfiniteQuery<
    PageData,
    Error,
    InfiniteData<PageData>,
    [string, AIType],
    number
  >({
    queryKey: [`${aiType}_chat`, aiType],
    queryFn: ({ pageParam }) => fetchSessionsByType({ aiType, pageParam }), // 여기서 리턴되는 데이터 값은 getNextPageParam의 인자 lastPage에 들어감.
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // console.log("Last page:", lastPage);
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    }
  });

  const sessionChats = useMemo(() => {
    // console.log("data", data);
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // aiType별 세션 전체 목록 가져올 때
  const fetchSessionsByType = useCallback(async ({ aiType, pageParam = 1 }: { aiType: AIType; pageParam: number }) => {
    try {
      setIsLoading(true);
      const url = aiType ? `/api/sessions?aiType=${aiType}&page=${pageParam}&limit=${ITEMS_PER_PAGE}` : "/api/sessions";
      const response = await fetch(url);
      // console.log("response", response);
      if (response.ok) {
        const data = await response.json();
        setSessions((prev) => [...prev, ...data.data]); // 기존 세션에 새 데이터 추가
        // console.log("Fetched data", data);
        return {
          data: data.data,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          nextPage: data.nextPage,
          currentPage: data.page
        };
      } else {
        throw new Error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error checking sessions", error);
      throw error; // 에러를 다시 던져서 react-query가 처리할 수 있게 함
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   fetchSessionsByType({aiType, pageParam});
  // }, [fetchSessionsByType, aiType]);

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
        setSessions((prev) => [...prev, newSession]);
        setCurrentSessionId(newSession.session_id);
        return { success: true, session: newSession };
      } else if (response.status === 401) {
        // 인증되지 않은 사용자일 경우
        return { success: false, error: "unauthorized" };
      } else if (response.status === 429) {
        // 일일 제한 도달 시
        return { success: false, error: "limit_reached" };
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

  // const checkAuthValidation = () => {
  //   openModal("로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동하시겠습니까?", "확인");
  // };

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

  return {
    sessionChats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
    isSuccess,
    currentSessionId,
    createSession,
    endSession,
    setCurrentSession,
    isLoading
  };
}
