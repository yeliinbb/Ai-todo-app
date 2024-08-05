"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { AIType, Message, MessageWithButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AssistantMessageItem from "./AssistantMessageItem";
import ChatInput from "./ChatInput";
import { getDateDay } from "@/lib/utils/getDateDay";
import useChatSummary from "@/hooks/useChatSummary";
import { queryKeys } from "@/lib/queryKeys";

interface AssistantChatProps {
  sessionId: string;
  aiType: AIType;
}

export type MutationContext = {
  previousMessages: MessageWithButton[] | undefined;
};

export type ServerResponse = {
  message: MessageWithButton[];
  todoListCompleted: boolean;
  newTodoItems: string[];
  askForListChoice: boolean;
  currentTodoList?: string[];
};

export type ChatTodoMode = "createTodo" | "recommend" | "resetTodo";

const AssistantChat = ({ sessionId, aiType }: AssistantChatProps) => {
  const { isLoading: sessionIsLoading } = useChatSession("assistant");
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [todoMode, setTodoMode] = useState<ChatTodoMode>("createTodo");
  const [currentTodoList, setCurrentTodoList] = useState<string[]>([]);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const {
    data: messages,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages,
    refetch: refetchMessages
  } = useQuery<MessageWithButton[]>({
    queryKey: [queryKeys.chat, aiType, sessionId],
    queryFn: async () => {
      if (!sessionId) return;
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setIsNewConversation(false); // 저장된 메시지를 불러올 때 isNewConversation을 false로 설정
      // console.log("data", data);
      return data.message || [];
    },
    enabled: !!sessionId,
    gcTime: 1000 * 60 * 30 // 30분 (이전의 cacheTime)
  });

  const sendMessageMutation = useMutation<ServerResponse, Error, string, MutationContext>({
    mutationFn: async (newMessage: string) => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newMessage, todoMode, currentTodoList })
      });

      // 수정할 때 스펠링이 잘못되면 오류를 던지는게 아니라 toast.warn 띄워주기
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setIsNewConversation(true);
      console.log("sendMessageMutation data", data);
      return data;
    },
    onMutate: async (newMessage): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.chat, aiType, sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>([queryKeys.chat, aiType, sessionId]);

      const userMessage: MessageWithButton = {
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
      console.log("sendMessageMutation data", data);

      queryClient.setQueryData<MessageWithButton[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
        // console.log("oldData", oldData);
        const withoutOptimisticUpdate = oldData.slice(0, -1);
        return [...withoutOptimisticUpdate, ...data.message];
      });

      if (data.currentTodoList) {
        setCurrentTodoList(data.currentTodoList);
      }

      if (data.newTodoItems && data.newTodoItems.length > 0) {
        // console.log("newTodoItems", data.newTodoItems.length > 0);
        // setIsResetButton(true);
        setCurrentTodoList((prevList) => {
          const updatedList = [...new Set([...prevList, ...data.newTodoItems])];
          return updatedList;
        });
      }
      setTodoMode("createTodo");
      setIsNewConversation(true);
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData([queryKeys.chat, aiType, sessionId], context?.previousMessages);
      }
    }
  });

  const saveTodoMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ saveTodo: true, currentTodoList, isResetButton: false })
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
      queryClient.setQueryData<MessageWithButton[] | undefined>(
        [queryKeys.chat, aiType, sessionId],
        (oldData): MessageWithButton[] | undefined => {
          if (!oldData) return [savedMessage];
          const updatedData = oldData.map((msg) => ({ ...msg, showSaveButton: false }));
          return [...updatedData, savedMessage];
        }
      );
      setCurrentTodoList([]); // 저장 후 currentTodoList 초기화
    },
    onError: (error) => {
      console.error("Error saving todo list :", error);
    }
  });

  // if (isSuccessMessages) {
  //   console.log("messages", messages);
  // }

  const { triggerSummary } = useChatSummary(sessionId, messages, aiType);
  useEffect(() => {
    if (isSuccessMessages && messages.length > 0) {
      triggerSummary();
    }
  }, [messages, triggerSummary, isSuccessMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // messages가 변경될 때마다 실행

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30; // 30px 여유
      setShouldScrollToBottom(isAtBottom);
    }
  };

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

  const handleCreateTodoList = async () => {
    setTodoMode("createTodo");
    const btnMessage = "새로운 투두리스트를 작성하고 싶어";
    await sendMessageMutation.mutateAsync(btnMessage);
    setCurrentTodoList([]);
  };

  const handleRecommendTodoList = async () => {
    setTodoMode("recommend");
    const btnMessage = "투두리스트 추천받고 싶어";
    await sendMessageMutation.mutateAsync(btnMessage);
    setCurrentTodoList([]);
  };

  // 저장하기 누르면 일반 대화로 돌아가기?
  const handleSaveButton = useCallback(() => {
    saveTodoMutation.mutate();
    queryClient.setQueryData<MessageWithButton[] | undefined>(
      [queryKeys.chat, aiType, sessionId],
      (oldData): MessageWithButton[] => {
        if (!oldData) return [];
        return oldData.map((msg: MessageWithButton) => ({ ...msg, showSaveButton: false }));
      }
    );
  }, [saveTodoMutation, queryClient, aiType, sessionId]);

  const handleResetButton = async () => {
    setTodoMode("resetTodo");
    setCurrentTodoList([]);
    await sendMessageMutation.mutateAsync("투두리스트 초기화해줘");
    // setIsResetButton(false);
  };

  if (isPendingMessages) {
    return <div>Loading session...</div>;
  }

  return (
    <>
      <div className="bg-paiTrans-10080 backdrop-blur-xl flex-grow rounded-t-3xl flex flex-col h-full">
        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-grow overflow-y-auto pb-[180px] p-4">
          <div className="text-gray-600 text-center my-2 leading-6 text-sm font-normal">{getDateDay()}</div>
          {isSuccessMessages && messages && messages.length > 0 && (
            <ul>
              {messages?.map((message, index) => (
                <AssistantMessageItem
                  key={index}
                  message={message}
                  handleSaveButton={handleSaveButton}
                  isPending={sendMessageMutation.isPending}
                  isLatestAIMessage={
                    message.role === "assistant" && index === messages.findLastIndex((m) => m.role === "assistant")
                  }
                  isNewConversation={isNewConversation}
                  handleResetButton={handleResetButton}
                  todoMode={todoMode}
                />
              ))}
            </ul>
          )}
        </div>
        <div className="flex w-full gap-2 fixed bottom-[88px] left-0 right-0 p-4">
          <button
            onClick={handleCreateTodoList}
            className="bg-grayTrans-90020 p-5 mb-2 backdrop-blur-xl rounded-xl text-system-white w-full min-w-10 text-sm leading-7 tracking-wide font-semibold"
          >
            투두리스트 작성하기
          </button>
          <button
            onClick={handleRecommendTodoList}
            className="bg-grayTrans-90020 p-5 mb-2 backdrop-blur-xl rounded-xl text-system-white w-full min-w-10 text-sm leading-7 tracking-wide font-semibold"
          >
            투두리스트 추천받기
          </button>
          {/* 아래 공간 띄워주는 용도 div */}
          <div className="h-7"></div>
        </div>
        <ChatInput
          textRef={textRef}
          handleKeyDown={handleKeyDown}
          handleSendMessage={handleSendMessage}
          isPending={sendMessageMutation.isPending}
        />
      </div>
    </>
  );
};

export default AssistantChat;
