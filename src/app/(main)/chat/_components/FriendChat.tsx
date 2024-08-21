"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { AIType, Message, MessageWithButton } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import FriendMessageItem from "./FriendMessageItem";
import ChatInput from "./ChatInput";
import { getDateDay } from "@/lib/utils/getDateDay";
import useChatSummary from "@/hooks/useChatSummary";
import ChatSkeleton from "./ChatSkeleton";
import { saveDiaryEntry } from "@/lib/utils/diaries/saveDiaryEntry";
import { nanoid } from "nanoid";
import { queryKeys } from "@/lib/constants/queryKeys";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/useModal";
import { getFormattedKoreaTime, getFormattedKoreaTimeWithOffset } from "@/lib/utils/getFormattedLocalTime";

interface FriendChatProps {
  sessionId: string;
  aiType: AIType;
}

export type MutationContext = {
  previousMessages: MessageWithButton[] | undefined;
};

const FriendChat = ({ sessionId, aiType }: FriendChatProps) => {
  //   const { isLoading: sessionIsLoading } = useChatSession("friend");
  const [userId, setUserId] = useState<string | null>(null);
  const [diaryId, setDiaryId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [isDiaryMode, setIsDiaryMode] = useState(false);
  const [diaryContent, setDiaryContent] = useState("");
  const [showSaveDiaryButton, setShowSaveDiaryButton] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [diaryTitle, setDiaryTitle] = useState("오늘의 일기");
  const [diaryDate, setDiaryDate] = useState<string>("");
  const router = useRouter();
  const { openModal, Modal } = useModal();

  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };

    setDiaryId(nanoid());
    fetchUserEmail();
  }, [supabase.auth]);

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
      setIsNewConversation(false);
      return data.message || [];
    },
    enabled: !!sessionId,
    gcTime: 1000 * 60 * 30
  });

  const sendMessageMutation = useMutation<MessageWithButton[], Error, string, MutationContext>({
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
      setIsNewConversation(true);
      return data.message;
    },
    onMutate: async (newMessage): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.chat, aiType, sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>([queryKeys.chat, aiType, sessionId]);

      const userMessage: MessageWithButton = {
        role: "user" as const,
        content: newMessage,
        created_at: getFormattedKoreaTime()
      };

      const tempAIMessage: MessageWithButton = {
        role: "assistant" as const,
        content: "답변을 작성 중입니다. 조금만 기다려주세요.",
        created_at: getFormattedKoreaTimeWithOffset(), // 사용자 메시지보다 1ms 후
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
      queryClient.setQueryData<MessageWithButton[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
        const withoutOptimisticUpdate = oldData.slice(0, -2);
        const newMessages = [...withoutOptimisticUpdate, ...data];

        if (isDiaryMode) {
          const lastAIMessage = data.find((msg) => msg.role === "friend");
          if (lastAIMessage) {
            if (lastAIMessage.content.includes("오늘 하루는 어땠어?")) {
              setShowSaveDiaryButton(false);
            } else if (lastAIMessage.content.includes("네가 얘기해준 내용을 바탕으로 일기를 작성해봤어")) {
              // 제목과 내용 추출
              const parts = lastAIMessage.content.split("\n\n");
              const titlePart = parts[0].match(/제목은 "(.+)"야/);
              const extractedTitle = titlePart ? titlePart[1] : "오늘의 일기";
              const diaryContentOnly = parts[1];

              setDiaryTitle(extractedTitle);
              setDiaryContent(diaryContentOnly);
              setShowSaveDiaryButton(true);
            }
          }
        }

        return newMessages;
      });
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData([queryKeys.chat, aiType, sessionId], context?.previousMessages);
      }
    }
  });

  const saveDiaryMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: content, saveDiary: true })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save diary");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsDiaryMode(false);
      setDiaryContent("");
      setShowSaveDiaryButton(false);
    },
    onError: (error: Error) => {
      console.error("Error saving diary:", error.message);
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
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30; // 30px 여유
      setShouldScrollToBottom(isAtBottom);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

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
          queryClient.setQueryData<Message[]>([queryKeys.chat, aiType, sessionId], (oldData = []) => {
            const newMessage = payload.new as Message;

            if (oldData.some((msg) => msg.created_at === newMessage.created_at)) return oldData;
            return [...oldData, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient, aiType, sessionId]);

  const handleCreateDiaryList = async () => {
    setIsDiaryMode(true);
    setShowSaveDiaryButton(false);
    const btnMessage = "일기를 작성해줘";
    await sendMessageMutation.mutateAsync(btnMessage);
  };

  const handleSaveDiary = async () => {
    if (diaryContent && userEmail) {
      try {
        // 한국 시간 기준으로 변경 필요
        const date = new Date().toISOString().split("T")[0];

        // 날짜, 제목, 내용을 제외한 전체 일기 내용 생성
        const fullDiaryContent = `${diaryContent}`;

        await saveDiaryEntry(date, diaryTitle, fullDiaryContent, diaryId, userEmail);
        
        setIsDiaryMode(false);
        setDiaryContent("");
        setDiaryTitle("오늘의 일기");
        setShowSaveDiaryButton(false);
        openModal(
          {
            message: "다이어리 페이지로 이동하여\n작성된 내용을 확인해보시겠어요?",
            confirmButton: { text: "확인", style: "fai" },
            cancelButton: { text: "취소", style: "취소" }
          },
          () => router.push("/diary")
        );
      } catch (error) {
        console.error("일기 저장 중 오류 발생:", error);
        alert("일기 저장에 실패했습니다. 다시 시도해 주세요.");
      }
    } else if (!userEmail) {
      alert("사용자 인증에 실패했습니다. 다시 로그인해 주세요.");
    }
  };

  const handleSendMessage = async () => {
    if (!textRef.current || !textRef.current.value.trim() || sendMessageMutation.isPending) {
      return;
    }
    const newMessage = textRef.current.value;
    textRef.current.value = "";

    await sendMessageMutation.mutateAsync(newMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <Modal />
      <div className="bg-faiTrans-20080 border-fai-300 border-x-2 border-t-2 desktop:border-x-4 desktop:border-t-4 border-b-0 backdrop-blur-xl rounded-t-[48px] desktop:rounded-t-[90px] flex-grow flex flex-col mt-[10px] min-h-[-webkit-fill-available]">
        <div className="text-gray-600 text-center py-5 px-4 text-bc5 flex items-center justify-center desktop:text-bc2 desktop:py-7">
          {getDateDay()}
        </div>
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto scroll-smooth pb-[180px] px-4 pt-4 desktop:px-[3.25rem]"
        >
          {isPendingMessages ? <ChatSkeleton /> : null}
          {isSuccessMessages && messages && messages.length > 0 && (
            <ul>
              {messages?.map((message, index) => (
                <FriendMessageItem
                  key={nanoid() + index}
                  message={message}
                  isLatestAIMessage={
                    message.role === "friend" && index === messages.findLastIndex((m) => m.role === "friend")
                  }
                  isNewConversation={isNewConversation}
                  showSaveDiaryButton={showSaveDiaryButton}
                  handleSaveDiary={handleSaveDiary}
                />
              ))}
            </ul>
          )}
        </div>
        <div className="pb-safe">
          <div className="fixed bottom-[88px] left-0 right-0 p-4 flex flex-col w-full">
            <div className="grid grid-cols-2 gap-2 w-full max-w-[778px] mx-auto mb-2">
              <button
                onClick={handleCreateDiaryList}
                className="bg-grayTrans-90020 px-6 py-3 backdrop-blur-xl rounded-2xl text-system-white w-full max-w-[383px] min-w-[165px] text-sh6 desktop:text-sh4 cursor-pointer"
              >
                일기 작성하기
              </button>
            </div>
            <div className="">
              <ChatInput
                textRef={textRef}
                handleKeyDown={handleKeyDown}
                handleSendMessage={handleSendMessage}
                isPending={sendMessageMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendChat;
