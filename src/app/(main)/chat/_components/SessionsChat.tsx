"use client";
import useChatSession from "@/hooks/useChatSession";
import { AIType, ChatSession } from "@/types/chat.session.type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchListBox from "@/components/search/SearchListBox";
import { getDateYear } from "@/lib/utils/getDateYear";
import SearchListBoxSkeleton from "@/components/search/SearchListBoxSkeleton";
import { useInView } from "react-intersection-observer";

interface SessionsChatProps {
  aiType: AIType;
  searchQuery: string;
  isFai: boolean;
}

const SessionsChat = ({ aiType, searchQuery, isFai }: SessionsChatProps) => {
  const { sessionChats, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, error, isSuccess } =
    useChatSession(aiType);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 180px)");
  const { ref, inView } = useInView({
    // threshold: 0,
    triggerOnce: false, // 한 번만 트리거되지 않도록 설정
    root: null // null로 설정하여 viewport를 기준으로 감지,
    // rootMargin: "0px 0px -10% 0px"
  });

  console.log("inView", inView);
  // console.log("sessionChats", sessionChats);

  const displayedChats = useMemo(() => {
    if (!sessionChats) return [];
    if (!searchQuery.trim()) return sessionChats; // 검색어 없으면 모든 채팅 반환
    return sessionChats.filter((chat: ChatSession) => {
      return chat?.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [sessionChats, searchQuery]);

  const loadMoreData = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const isDesktop = windowWidth > 1280; // 1280px 이상을 데스크탑으로 가정

      let newHeight;
      if (isDesktop) {
        newHeight = Math.min(windowHeight - 180, 900); // 데스크탑: 최대 900px
      } else {
        newHeight = Math.min(windowHeight - 180, 600); // 모바일: 최대 600px
      }

      setContainerHeight(`${newHeight}px`);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      loadMoreData();
    }
  }, [loadMoreData, inView]);

  useEffect(() => {
    if (!isPending && !isSuccess && !error) {
      fetchNextPage();
    }
  }, [fetchNextPage, isPending, isSuccess, error]);

  if (isPending) return <SearchListBoxSkeleton />;

  if (error) return <div>검색 결과가 없습니다.</div>;

  return (
    <div
      ref={scrollContainerRef}
      className="scroll-container overflow-y-scroll scroll-smooth max-h-[calc(100vh-200px)]"
    >
      {displayedChats?.length > 0 ? (
        <ul>
          {displayedChats?.map((chat, index) => {
            const { session_id, summary, created_at } = chat;
            const dateYear = getDateYear(created_at);
            return (
              <SearchListBox
                key={index}
                id={session_id}
                title={summary ?? ""}
                dateYear={dateYear}
                aiType={aiType}
                isFai={isFai}
              />
            );
          })}
          <div ref={ref} className="h-10 flex items-center justify-center">
            {isFetchingNextPage ? (
              <p>로딩 중...</p>
            ) : hasNextPage ? (
              <p>더 많은 결과 불러오는 중...</p>
            ) : (
              <p>모든 결과를 불러왔습니다.</p>
            )}
          </div>
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SessionsChat;
