"use client";
import useChatSession from "@/hooks/useChatSession";
import { useQuery } from "@tanstack/react-query";

const SessionsAssistantChat = () => {
  const { fetchSessionsByType } = useChatSession("assistant");
  const { data: assistantChats, error } = useQuery({
    queryKey: ["assistant_chat"],
    queryFn: async () => fetchSessionsByType("assistant")
  });
  console.log("assistantChats", assistantChats);
  return <div>SessionsAssistantChat</div>;
};

export default SessionsAssistantChat;
