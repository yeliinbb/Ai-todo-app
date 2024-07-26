"use client";
import useChatSession from "@/hooks/useChatSession";
import { useQuery } from "@tanstack/react-query";
import { AIType, Chat } from "@/types/chat.session.type";

const SessionsChat = ({ aiType }: { aiType: AIType }) => {
  const { fetchSessionsByType } = useChatSession(aiType);
  const aiTypeText = aiType === "assistant" ? "Assistant" : "Friend";

  const {
    data: sessionChats,
    isPending,
    error,
    isSuccess
  } = useQuery<Chat[]>({
    queryKey: [`${aiType}_chat`],
    queryFn: async () => {
      const chats = await fetchSessionsByType(aiType);
      console.log("chats", chats);
      const filteredChats = chats.filter((chat: Chat) => (chat.messages === null ? null : chat));
      return filteredChats;
    }
  });

  // console.log("sessionChats", sessionChats);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error : {error?.message}</div>;
  }

  return (
    <div>
      <p>{aiTypeText}</p>
      {isSuccess && sessionChats.length > 0 ? (
        <ul>
          {sessionChats.map((chat, index) => (
            <li key={index}>{chat?.session_id}</li>
          ))}
        </ul>
      ) : (
        <p>No {aiType} chats found</p>
      )}
    </div>
  );
};

export default SessionsChat;
