"use client";
import useChatSession from "@/hooks/useChatSession";
import { useQuery } from "@tanstack/react-query";
import { AIType, Chat, ChatSession } from "@/types/chat.session.type";
import Link from "next/link";
import { useMemo } from "react";
import SearchListBox from "@/components/SearchListBox";
import { getDateYear } from "@/lib/utils/getDateYear";

interface SessionsChatProps {
  aiType: AIType;
  searchQuery: string;
}

const SessionsChat = ({ aiType, searchQuery }: SessionsChatProps) => {
  const { fetchSessionsByType } = useChatSession(aiType);
  // const aiTypeText = aiType === "assistant" ? "Assistant" : "Friend";

  const {
    data: sessionChats,
    isPending,
    error,
    isSuccess
  } = useQuery<ChatSession[]>({
    queryKey: [`${aiType}_chat`],
    queryFn: async () => {
      const chats = await fetchSessionsByType(aiType);
      // console.log("chats", chats);
      const filteredChats = chats.filter((chat: ChatSession) => (chat.messages === null ? null : chat));
      return filteredChats;
    }
  });

  // console.log("sessionChats", sessionChats);

  const displayedChats = useMemo(() => {
    if (!sessionChats) return [];
    if (!searchQuery.trim()) return sessionChats; // 검색어 없으면 모든 채팅 반환
    return sessionChats.filter((chat: ChatSession) => {
      return chat?.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [sessionChats, searchQuery]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error : {error?.message}</div>;
  }

  return (
    <div>
      {isSuccess && displayedChats?.length > 0 ? (
        <ul className="h-full overflow-y-auto max-h-[calc(100vh-150px)]">
          {displayedChats?.map((chat, index) => {
            const { session_id, summary, created_at } = chat;
            const dateYear = getDateYear(created_at);
            return (
              <SearchListBox key={index} id={session_id} title={summary ?? ""} dateYear={dateYear} aiType={aiType} />
            );
          })}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SessionsChat;
