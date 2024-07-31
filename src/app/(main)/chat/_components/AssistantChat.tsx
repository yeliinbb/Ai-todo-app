"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { Message, MessageWithSaveButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AssistantMessageItem from "./AssistantMessageItem";
import ChatInput from "./ChatInput";
import { getDateDay } from "@/lib/utils/getDateDay";
import useChatSummary from "@/hooks/useChatSummary";
import { queryKeys } from "@/lib/constants/queryKeys";

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
  const aiType = "assistant";

  const {
    data: messages,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages,
    refetch: refetchMessages
  } = useQuery<MessageWithSaveButton[]>({
    queryKey: [queryKeys.chat, aiType, sessionId],
    queryFn: async () => {
      if (!sessionId) return;
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log("data", data);
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
      await queryClient.cancelQueries({ queryKey: [queryKeys.chat, aiType, sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>([queryKeys.chat, aiType, sessionId]);

      const userMessage: MessageWithSaveButton = {
        role: "user" as const,
        content: newMessage,
        created_at: new Date().toISOString(),
        showSaveButton: false
      };

      queryClient.setQueryData<Message[]>([queryKeys.chat, aiType, sessionId], (oldData) => [
        ...(oldData || []),
        userMessage
      ]);

      return { previousMessages };
    },
    onSuccess: (data, variables, context) => {
      console.log("data", data);
      queryClient.setQueryData<MessageWithSaveButton[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
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
    // // 쿼리 무효화되어 저장하기 버튼 안 뜨는 관계로 로직 삭제
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: [queryKeys.chat, aiType, sessionId] });
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
        [queryKeys.chat, aiType, sessionId],
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
  const { triggerSummary } = useChatSummary(sessionId, messages);
  useEffect(() => {
    if (isSuccessMessages && messages.length > 0) {
      triggerSummary();
    }
  }, [messages, triggerSummary]);

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
    const messageToSend = isTodoMode ? `투두리스트에 추가 : ${newMessage}` : newMessage;
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
      [queryKeys.chat, aiType, sessionId],
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
    <div className="bg-paiTrans-10080 backdrop-blur-xl p-4 min-h-screen rounded-t-3xl flex flex-col">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto pb-[180px]">
        <div className="text-gray-600 text-center my-2 leading-6 text-sm font-normal">{getDateDay()}</div>
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
        {/* 인풋 높이값만큼 레이어 깔기 */}
        {/* <div className="h-1"></div> */}
        <div className="fixed bottom-0 left-0 right-0 p-4 rounded-t-3xl">
          <button
            onClick={handleCreateTodoList}
            className="bg-grayTrans-90020 p-5 mb-2 backdrop-blur-xl rounded-xl text-system-white w-fit text-sm leading-7 tracking-wide font-semibold"
            disabled={isTodoMode ? true : false}
          >
            {isTodoMode ? "다른 대화 계속하기" : "투두리스트 작성하기"}
          </button>
          <ChatInput
            textRef={textRef}
            handleKeyDown={handleKeyDown}
            handleSendMessage={handleSendMessage}
            sendMessageMutation={sendMessageMutation}
          />
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
