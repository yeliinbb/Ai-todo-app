"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { AIType, Message } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import FriendMessageItem from "./FriendMessageItem";
import ChatInput from "./ChatInput";
import { getDateDay } from "@/lib/utils/getDateDay";
import { queryKeys } from "@/lib/queryKeys";

interface FriendChatProps {
  sessionId: string;
  aiType: AIType;
}

export type MutationContext = {
  previousMessages: Message[] | undefined;
};

const FriendChat = ({ sessionId, aiType }: FriendChatProps) => {
  const { isLoading: sessionIsLoading } = useChatSession("friend");
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isNewConversation, setIsNewConversation] = useState(true);
  console.log("aiType", aiType);

  const {
    data: messages,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: [queryKeys.chat, aiType, sessionId],
    queryFn: async () => {
      if (!sessionId) return;
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setIsNewConversation(false);
      return data.message || [];
    },
    enabled: !!sessionId,
    gcTime: 1000 * 60 * 30
  });

  const sendMessageMutation = useMutation<Message[], Error, string, MutationContext>({
    mutationFn: async (newMessage: string) => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API error:", response.status, errorBody);
        throw new Error(`Network response was not ok: ${response.status} ${errorBody}`);
      }

      const data = await response.json();
      setIsNewConversation(true);
      console.log("sendMessageMutation data", data);
      return data.message;
    },
    onMutate: async (newMessage): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.chat, aiType, sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>([queryKeys.chat, aiType, sessionId]);

      const userMessage: Message = {
        role: "user" as const,
        content: newMessage,
        created_at: new Date().toISOString()
      };

      queryClient.setQueryData<Message[]>([queryKeys.chat, aiType, sessionId], (oldData) => [
        ...(oldData || []),
        userMessage
      ]);

      return { previousMessages };
    },
    onSuccess: (data, variables, context) => {
      console.log("onSuccess data", data);
      queryClient.setQueryData<Message[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
        console.log("oldData", oldData);
        const withoutOptimisticUpdate = oldData.slice(0, -1);
        console.log("withoutOptimisticUpdate", withoutOptimisticUpdate);
        return [...withoutOptimisticUpdate, ...data];
      });
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData([queryKeys.chat, aiType, sessionId], context?.previousMessages);
      }
    }
  });

  if (isSuccessMessages) {
    console.log("messages", messages);
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    if (!sessionId) {
      return;
    }

    const channel = supabase
      .channel(`messages_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: CHAT_SESSIONS,
          filter: `session_id=eq.${sessionId}`
        },
        (payload: RealtimePostgresInsertPayload<Message>) => {
          // console.log("New message received", payload.new);
          queryClient.setQueryData<Message[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
            const newMessage = payload.new as Message;

            if (oldData.some((msg) => msg.created_at === newMessage.created_at)) return oldData;
            return [...oldData, { ...newMessage, showSaveButton: true }];
          });
        }
      )
      .subscribe();

    // cleanup 함수 : 실시간 구독 취소
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient, aiType, sessionId]);

  const handleSendMessage = async () => {
    if (!textRef.current && !textRef.current!.value.trim() && sendMessageMutation.isPending) {
      return;
    }
    const newMessage = textRef.current!.value;
    textRef.current!.value = "";

    await sendMessageMutation.mutateAsync(newMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (sessionIsLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <>
      <div className="bg-faiTrans-20080 backdrop-blur-xl flex-grow rounded-t-3xl flex flex-col h-full">
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto pb-[180px] p-4">
          <div className="text-gray-600 text-center my-2 leading-6 text-sm font-normal">{getDateDay()}</div>
          {isSuccessMessages && messages && messages.length > 0 && (
            <ul>
              {messages?.map((message, index) => (
                <FriendMessageItem
                  key={index}
                  message={message}
                  isPending={sendMessageMutation.isPending}
                  isLatestAIMessage={
                    message.role === "friend" && index === messages.findLastIndex((m) => m.role === "friend")
                  }
                  isNewConversation={isNewConversation} // 새로운 prop 전달
                />
              ))}
            </ul>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 rounded-t-3xl">
          {/* 아래 공간 띄워주는 용도 div */}
          <div className="h-7"></div>
          <ChatInput
            textRef={textRef}
            handleKeyDown={handleKeyDown}
            handleSendMessage={handleSendMessage}
            isPending={sendMessageMutation.isPending}
          />
        </div>
      </div>
    </>
  );
};

export default FriendChat;
