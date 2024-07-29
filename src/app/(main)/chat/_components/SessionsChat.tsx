"use client";
import useChatSession from "@/hooks/useChatSession";
import { useQuery } from "@tanstack/react-query";
import { AIType, Chat, ChatSession } from "@/types/chat.session.type";
import Link from "next/link";
import { useMemo } from "react";

interface SessionsChatProps {
  aiType: AIType;
  searchQuery: string;
}

const SessionsChat = ({ aiType, searchQuery }: SessionsChatProps) => {
  const { fetchSessionsByType } = useChatSession(aiType);
  const aiTypeText = aiType === "assistant" ? "Assistant" : "Friend";

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
      <p>{aiTypeText}</p>
      {isSuccess && displayedChats?.length > 0 ? (
        <ul>
          {displayedChats?.map((chat, index) => (
            <Link key={index} href={`/chat/${aiType}/${chat.session_id}`}>
              <li>{chat?.summary}</li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>{searchQuery ? `No ${aiType} chats found for "${searchQuery}"` : `No ${aiType} chats available`}</p>
      )}
    </div>
  );
};

export default SessionsChat;
