"use client";
import useChatSession from "@/hooks/useChatSession";
import { useQuery } from "@tanstack/react-query";
import { AIType, Chat, ChatSession } from "@/types/chat.session.type";
import Link from "next/link";
import { useMemo } from "react";

interface SessionsChatProps {
  aiType: AIType;
  searchQuery: string;
  handleItemClick: (url: string) => void;
}

const SessionsChat = ({ aiType, searchQuery, handleItemClick }: SessionsChatProps) => {
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
        <ul>
          {displayedChats?.map((chat, index) => (
            <li
              key={index}
              className="truncate cursor-pointer"
              onClick={() => handleItemClick(`/chat/${aiType}/${chat.session_id}`)}
            >
              {chat?.summary}
            </li>
          ))}
        </ul>
      ) : (
        <p>{searchQuery ? `No ${aiType} chats found for "${searchQuery}"` : `No ${aiType} chats available`}</p>
      )}
    </div>
  );
};

export default SessionsChat;
