"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/tableNames";
import { Message, MessageWithSaveButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AssistantMessageItem from "./AssistantMessageItem";
import ChatInput from "./ChatInput";

interface AssistantChatProps {
  sessionId: string;
}

export type MutationContext = {
  previousMessages: MessageWithSaveButton[] | undefined;
};

const AssistantChat = ({ sessionId }: AssistantChatProps) => {
  const { endSession, isLoading: sessionIsLoading } = useChatSession("assistant");
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTodoMode, setIsTodoMode] = useState(false);
  // const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const aiType = "assistant";

  const {
    data: messages,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages,
    refetch: refetchMessages
  } = useQuery<MessageWithSaveButton[]>({
    queryKey: ["chat_sessions", aiType, sessionId],
    queryFn: async () => {
      if (!sessionId) return;
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log("data", data);
      // return data[0].messages || [];
      return data.message || [];
    },
    enabled: !!sessionId,
    gcTime: 1000 * 60 * 30 // 30분 (이전의 cacheTime)
  });

  const sendMessageMutation = useMutation<MessageWithSaveButton[], Error, string, MutationContext>({
    mutationFn: async (newMessage: string) => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("sendMessageMutation data", data);
      return data.message;
    },
    onMutate: async (newMessage): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["chat_sessions", aiType, sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>(["chat_sessions", aiType, sessionId]);

      const userMessage: MessageWithSaveButton = {
        role: "user" as const,
        content: newMessage,
        created_at: new Date().toISOString(),
        showSaveButton: false
      };

      queryClient.setQueryData<Message[]>(["chat_sessions", aiType, sessionId], (oldData) => [
        ...(oldData || []),
        userMessage
      ]);

      return { previousMessages };
    },
    onSuccess: (data, variables, context) => {
      console.log("data", data);
      queryClient.setQueryData<MessageWithSaveButton[]>(["chat_sessions", aiType, sessionId], (oldData = []) => {
        console.log("oldData", oldData);
        const withoutOptimisticUpdate = oldData.slice(0, -1);
        console.log("withoutOptimisticUpdate", withoutOptimisticUpdate);
        return [...withoutOptimisticUpdate, ...data];
      });
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData(["chat_sessions", aiType, sessionId], context?.previousMessages);
      }
    }
    // // 쿼리 무효화되어 저장하기 버튼 안 뜨는 관계로 로직 삭제
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["chat_sessions", aiType, sessionId] });
    // }
  });

  const saveTodoMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ saveTodo: true })
      });
      if (!response.ok) {
        throw new Error("Failed to save todo list");
      }
      const data = await response.json();
      console.log("saveTodoMutation", data);
      return data;
    },
    onSuccess: () => {
      const savedMessage = {
        role: "assistant" as const,
        content: "투두리스트가 저장되었습니다.",
        created_at: new Date().toISOString(),
        showSaveButton: false
      };
      queryClient.setQueryData<MessageWithSaveButton[] | undefined>(
        ["chat_sessions", aiType, sessionId],
        (oldData): MessageWithSaveButton[] | undefined => {
          if (!oldData) return [savedMessage];
          const updatedData = oldData.map((msg) => ({ ...msg, showSaveButton: false }));
          return [...updatedData, savedMessage];
        }
      );
    },
    onError: (error) => {
      console.error("Error saving todo list :", error);
    }
  });

  if (isSuccessMessages) {
    console.log("messages", messages);
  }

  useEffect(() => {
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
          queryClient.setQueryData<Message[]>(["chat_sessions", aiType, sessionId], (oldData = []) => {
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
    const messageToSend = isTodoMode ? `투두리스트에 추가 : ${newMessage}` : newMessage;
    // const messageToSend = `투두리스트에 추가 : ${newMessage}`;
    sendMessageMutation.mutate(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCreateTodoList = async () => {
    setIsTodoMode(true);
    const btnMessage = "투두리스트를 작성하고 싶어요.";
    await sendMessageMutation.mutateAsync(btnMessage);
    // setIsTodoMode(false);
  };

  const handleSaveButton = useCallback(() => {
    saveTodoMutation.mutate();
    queryClient.setQueryData<MessageWithSaveButton[] | undefined>(
      ["chat_sessions", aiType, sessionId],
      (oldData): MessageWithSaveButton[] => {
        if (!oldData) return [];
        return oldData.map((msg: MessageWithSaveButton) => ({ ...msg, showSaveButton: false }));
      }
    );
  }, [saveTodoMutation, queryClient, aiType, sessionId]);

  if (sessionIsLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="bg-[#F2F2F2]">
      <div ref={chatContainerRef}>
        <div className="bg-[#888888] text-white">2024년 7월 25일 목요일</div>
        {isSuccessMessages && messages && messages.length > 0 && (
          <ul>
            {messages?.map((message, index) => (
              <AssistantMessageItem
                key={index}
                message={message}
                handleSaveButton={handleSaveButton}
                saveTodoMutation={saveTodoMutation}
              />
            ))}
          </ul>
        )}
        <button onClick={handleCreateTodoList} className="bg-black text-white" disabled={isTodoMode ? true : false}>
          {isTodoMode ? "다른 대화 계속하기" : "투두리스트 작성하기"}
        </button>
        <ChatInput
          textRef={textRef}
          handleKeyDown={handleKeyDown}
          handleSendMessage={handleSendMessage}
          sendMessageMutation={sendMessageMutation}
        />
        <button onClick={() => endSession(sessionId)}>End Session</button>
      </div>
    </div>
  );
};

export default AssistantChat;
