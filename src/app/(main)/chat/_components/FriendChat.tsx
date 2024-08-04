"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { AIType, Message, MessageWithSaveButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import FriendMessageItem from "./FriendMessageItem";
import ChatInput from "./ChatInput";
import { getDateDay } from "@/lib/utils/getDateDay";
import useChatSummary from "@/hooks/useChatSummary";
import { queryKeys } from "@/lib/queryKeys";

interface FriendChatProps {
  sessionId: string;
  aiType: AIType;
}

export type MutationContext = {
  previousMessages: MessageWithSaveButton[] | undefined;
};

export type ServerResponse = {
  message: MessageWithSaveButton[];
  diaryListCompleted: boolean;
  newDiaryItems: string[];
  askForListChoice: boolean;
  currentDiaryList?: string[];
};

const FriendChat = ({ sessionId, aiType }: FriendChatProps) => {
  const { isLoading: sessionIsLoading } = useChatSession("friend");
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDiaryMode, setIsDiaryMode] = useState(false);
  const [currentDiaryList, setCurrentDiaryList] = useState<string[]>([]);
  const [isNewConversation, setIsNewConversation] = useState(true);

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
      setIsNewConversation(false);
      return data.message || []; // data.message;로 수정 끝
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
        body: JSON.stringify({ message: newMessage, isDiaryMode, currentDiaryList })
      });

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
      console.log("onSuccess data", data);
      queryClient.setQueryData<MessageWithSaveButton[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
        console.log("oldData", oldData);
        const withoutOptimisticUpdate = oldData.slice(0, -1);
        console.log("withoutOptimisticUpdate", withoutOptimisticUpdate);
        return [...withoutOptimisticUpdate, ...data.message];
      });

      if (data.currentDiaryList) {
        setCurrentDiaryList(data.currentDiaryList);
      } else if (data.newDiaryItems && data.newDiaryItems.length > 0) {
        setCurrentDiaryList((prevList) => {
          const updatedList = [...new Set([...prevList, ...data.newDiaryItems])];
          return updatedList;
        });
      }
      setIsNewConversation(true);
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData([queryKeys.chat, aiType, sessionId], context?.previousMessages);
      }
    }
  });

  const { isPending } = sendMessageMutation;

  const saveDiaryMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ saveDiary: true, currentDiaryList })
      });
      if (!response.ok) {
        throw new Error("Failed to save diary");
      }
      const data = await response.json();
      console.log("saveDiaryMutation", data);
      return data;
    },
    onSuccess: () => {
      const savedMessage = {
        role: "friend" as const,
        content: "다이어리가 저장되었습니다.",
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
      setCurrentDiaryList([]);
      setIsDiaryMode(false);
    },
    onError: (error) => {
      console.error("Error saving diary :", error);
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
  }, [messages, triggerSummary, isSuccessMessages]);

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

  const toggleDiaryMode = async () => {
    setIsDiaryMode((prev) => !prev);
    if (!isDiaryMode) {
      // 투두 모드로 전환할 때
      const btnMessage = "일기를 작성하고 싶어";
      await sendMessageMutation.mutateAsync(btnMessage);
      setCurrentDiaryList([]);
    } else {
      const btnMessage = "일반 채팅으로 돌아갑니다.";
      await sendMessageMutation.mutateAsync(btnMessage);
    }
  };

  const handleCreateDiaryList = async () => {
    setIsDiaryMode(true);
    const btnMessage = "일기를 작성하고 싶어";
    await sendMessageMutation.mutateAsync(btnMessage);
    // refetchMessages();
  };

  const handleSaveButton = useCallback(() => {
    saveDiaryMutation.mutate();
    queryClient.setQueryData<MessageWithSaveButton[] | undefined>(
      [queryKeys.chat, aiType, sessionId],
      (oldData): MessageWithSaveButton[] => {
        if (!oldData) return [];
        return oldData.map((msg: MessageWithSaveButton) => ({ ...msg, showSaveButton: false }));
      }
    );
  }, [saveDiaryMutation, queryClient, aiType, sessionId]);

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
                  handleSaveButton={handleSaveButton}
                  isPending={saveDiaryMutation.isPending}
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
          <button
            onClick={handleCreateDiaryList}
            className="bg-grayTrans-60080 p-5 mb-2 backdrop-blur-xl rounded-xl text-system-white w-fit text-sm leading-7 tracking-wide font-semibold"
          >
            {isDiaryMode ? "일반 채팅으로 돌아가기" : "일기 작성하기"}
          </button>
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
