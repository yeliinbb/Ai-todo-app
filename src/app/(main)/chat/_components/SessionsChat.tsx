"use client";
import useChatSession from "@/hooks/useChatSession";
import { AIType, ChatSession } from "@/types/chat.session.type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchListBox from "@/components/search/SearchListBox";
import { getDateYear } from "@/lib/utils/getDateYear";
import SearchListBoxSkeleton from "@/components/search/SearchListBoxSkeleton";
import { useInView } from "react-intersection-observer";
import NoSearchResult from "@/components/search/NoSearchResult";
import usePageCheck from "@/hooks/usePageCheck";
import SearchLoadingSpinner from "@/components/search/SearchLoadingSpinner";

interface SessionsChatProps {
  aiType: AIType;
  searchQuery: string;
  isFai: boolean;
}

const SessionsChat = ({ aiType, searchQuery, isFai }: SessionsChatProps) => {
  const { sessionChats, fetchNextPage, hasNextPage, isFetchingNextPage, isPendingChatList, error, isSuccess } =
    useChatSession(aiType);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("calc(100dvh - 180px)");
  const { isChatPage } = usePageCheck();
  const { ref, inView } = useInView({
    // threshold: 0,
    triggerOnce: false, // 한 번만 트리거되지 않도록 설정
    root: null // null로 설정하여 viewport를 기준으로 감지,
    // rootMargin: "0px 0px -10% 0px"
  });

  // console.log("inView", inView);
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

  // 반응형 높이를 동적으로 계산
  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const isDesktop = windowWidth > 1200; // 1200px 이상을 데스크탑으로 가정

      let newHeight;
      if (isDesktop) {
        newHeight = isChatPage ? Math.min(windowHeight - 220, 970) : Math.min(windowHeight - 150, 970); // 데스크탑: 최대 810px
      } else {
        newHeight = Math.min(windowHeight - 100, 500); // 모바일: 최대 500px
      }

      setContainerHeight(`${newHeight}px`);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    return () => window.removeEventListener("resize", updateContainerHeight);
  }, [isChatPage]);

  useEffect(() => {
    if (inView && hasNextPage) {
      loadMoreData();
    }
  }, [loadMoreData, inView, hasNextPage]);

  // if (isPendingChatList) return <SearchListBoxSkeleton />;

  if (error) return null;

  return (
    <div
      ref={scrollContainerRef}
      className="scroll-container overflow-y-scroll scroll-smooth flex flex-col"
      style={{ height: containerHeight }}
    >
      {isPendingChatList && <SearchListBoxSkeleton />}
      {displayedChats?.length > 0 ? (
        <ul className="px-4 mobile:mt-7 desktop:mt-7 desktop:pr-5 desktop:pl-[52px] flex-grow">
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
          <div ref={ref} className="h-10 py-4 flex items-center justify-center">
            {isFetchingNextPage ? (
              <SearchLoadingSpinner />
            ) : hasNextPage ? (
              <SearchLoadingSpinner />
            ) : (
              <p className="text-gray-600 text-bc4 desktop:text-bc2">결과를 모두 불러왔습니다.</p>
            )}
          </div>
        </ul>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <NoSearchResult />
        </div>
      )}
    </div>
  );
};

export default SessionsChat;
