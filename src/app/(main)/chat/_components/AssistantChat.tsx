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
import { queryKeys } from "@/lib/constants/queryKeys";
import ChatSkeleton from "./ChatSkeleton";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import useModal from "@/hooks/useModal";

interface AssistantChatProps {
  sessionId: string;
  aiType: AIType;
}

export type MutationContext = {
  previousMessages: MessageWithButton[] | undefined;
};

export type ServerResponse = {
  message: MessageWithButton[];
  newTodoItems: string[];
  askForListChoice: boolean;
  currentTodoList?: string[];
};

export type ChatTodoMode = "createTodo" | "recommendTodo" | "resetTodo";

const AssistantChat = ({ sessionId, aiType }: AssistantChatProps) => {
  // const { isLoading: sessionIsLoading } = useChatSession("assistant");
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [todoMode, setTodoMode] = useState<ChatTodoMode>("createTodo");
  const [currentTodoList, setCurrentTodoList] = useState<string[]>([]);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const { data } = useUserData();
  const userId = data?.user_id;
  const router = useRouter();
  const { openModal, Modal } = useModal();

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

      const tempAIMessage: MessageWithButton = {
        role: "assistant" as const,
        content: "답변을 작성 중입니다. 조금만 기다려주세요.",
        created_at: new Date(Date.now() + 1).toISOString(), // 사용자 메시지보다 1ms 후
        showSaveButton: false
      };

      queryClient.setQueryData<Message[]>([queryKeys.chat, aiType, sessionId], (oldData) => [
        ...(oldData || []),
        userMessage,
        tempAIMessage
      ]);

      return { previousMessages };
    },
    onSuccess: (data, variables, context) => {
      // console.log("sendMessageMutation data", data);
      queryClient.setQueryData<MessageWithButton[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
        // console.log("oldData", oldData);
        const withoutOptimisticUpdate = oldData.slice(0, -2);
        // console.log("withoutOptimisticUpdate", withoutOptimisticUpdate);
        // console.log("data.message", data.message);
        return [...withoutOptimisticUpdate, ...data.message];
      });

      // if (data.currentTodoList) {
      //   setCurrentTodoList(data.currentTodoList);
      // }

      if (data.newTodoItems && data.newTodoItems.length > 0) {
        // console.log("newTodoItems", data.newTodoItems.length > 0);
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
        content: "투두리스트 저장이 완료되었습니다. 저장된 내용을 투두리스트 페이지에서 확인해보세요!",
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
      // 투두리스트 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      setCurrentTodoList([]); // 저장 후 currentTodoList 초기화
      // alert("투두리스트 페이지로 이동하기");
      openModal(
        {
          message: "투두리스트 페이지로 이동하여\n작성된 내용을 확인해보시겠어요?",
          confirmButton: { text: "확인", style: "pai" },
          cancelButton: { text: "취소", style: "취소" }
        },
        // 이동 시 중간에 로딩 스피너 화면 띄워줘야함.
        () => router.push("/todo-list")
      );
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
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px 여유
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
        (payload: RealtimePostgresInsertPayload<MessageWithButton>) => {
          // console.log("New message received", payload.new);
          queryClient.setQueryData<MessageWithButton[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
            const newMessage = payload.new as MessageWithButton;

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
    setTodoMode("recommendTodo");
    const btnMessage = "투두리스트 추천받고 싶어";
    await sendMessageMutation.mutateAsync(btnMessage);
    setCurrentTodoList([]);
  };

  // 저장하기 누르면 일반 대화로 돌아가기?
  const handleSaveButton = useCallback(() => {
    saveTodoMutation.mutate();
  }, [saveTodoMutation]);

  const handleResetButton = async () => {
    setTodoMode("resetTodo");
    setCurrentTodoList([]);
    await sendMessageMutation.mutateAsync("투두리스트 초기화해줘");
  };

  return (
    <>
      <Modal />
      <div className="bg-paiTrans-10080 border-x-2 border-t-2 border-pai-300 border-b-0 backdrop-blur-xl rounded-t-[48px] flex-grow flex flex-col  mt-[10px] min-h-[-webkit-fill-available]">
        <div className="text-gray-600 text-center py-5 px-4 text-bc5 flex items-center justify-center">
          {getDateDay()}
        </div>
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto scroll-smooth pb-[180px] px-4 pt-4"
        >
          {isPendingMessages ? <ChatSkeleton /> : null}
          {isSuccessMessages && messages && messages.length > 0 && (
            <ul>
              {messages?.map((message, index) => (
                <>
                  <AssistantMessageItem
                    key={index}
                    message={message}
                    handleSaveButton={handleSaveButton}
                    isNewConversation={isNewConversation}
                    handleResetButton={handleResetButton}
                    todoMode={todoMode}
                  />
                </>
              ))}
            </ul>
          )}
        </div>
        {/* 하단 고정된 인풋과 버튼 */}
        <div className="pb-safe">
          <div className="fixed bottom-[88px] left-0 right-0 p-4 flex flex-col w-full">
            <div className="grid grid-cols-2 gap-2 w-full mb-2">
              <button
                onClick={handleCreateTodoList}
                className="bg-grayTrans-90020 px-6 py-3 backdrop-blur-xl rounded-2xl text-system-white w-full min-w-10 text-sm leading-7 tracking-wide font-bold cursor-pointer"
              >
                투두리스트 작성하기
              </button>
              <button
                onClick={handleRecommendTodoList}
                className="bg-grayTrans-90020 px-6 py-3 backdrop-blur-xl rounded-2xl text-system-white w-full min-w-10 text-sm leading-7 tracking-wide font-bold cursor-pointer"
              >
                투두리스트 추천받기
              </button>
            </div>
            <ChatInput
              textRef={textRef}
              handleKeyDown={handleKeyDown}
              handleSendMessage={handleSendMessage}
              isPending={sendMessageMutation.isPending}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantChat;
