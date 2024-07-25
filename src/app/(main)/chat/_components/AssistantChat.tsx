"use client";

import useChatSession from "@/hooks/useChatSession";
import { CHAT_SESSIONS } from "@/lib/tableNames";
import { formatTime } from "@/lib/utils/\bformatTime";
import { Message } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface AssistantChatProps {
  sessionId: string;
}

type MutationContext = {
  previousMessages: MessageWithSaveButton[] | undefined;
};

type MessageWithSaveButton = Message & {
  showSaveButton?: boolean;
};

const AssistantChat = ({ sessionId }: AssistantChatProps) => {
  const { endSession, isLoading: sessionIsLoading } = useChatSession("assistant");
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTodoMode, setIsTodoMode] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
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
      return data[0].messages || [];
    },
    enabled: !!sessionId
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
      const previousMessages = queryClient.getQueryData<Message[]>(["chat_sessions", aiType, sessionId]);
      queryClient.setQueryData<Message[]>(["chat_sessions", aiType, sessionId], (oldData) => [
        ...(oldData || []),
        { role: "user", content: newMessage, created_at: new Date().toISOString(), showSaveButton }
      ]);
      return { previousMessages };
    },
    onSuccess: (data) => {
      console.log("data", data);
      queryClient.setQueryData<MessageWithSaveButton[]>(["chat_sessions", aiType, sessionId], (oldData = []) => [
        ...oldData,
        ...data
      ]);
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData(["chat_sessions", aiType, sessionId], context?.previousMessages);
      }
    }
    // 쿼리 무효화되어 저장하기 버튼 안 뜨는 관계로 로직 삭제
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

  // if (isSuccessMessages) {
  //   console.log("messages", messages);
  // }

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
          queryClient.setQueryData<Message[]>(["chat_sessions", aiType, sessionId], (oldData = []) => {
            const newMessage = payload.new as Message;

            if (oldData.some((msg) => msg.created_at === newMessage.created_at))
              return [...oldData, { ...newMessage, showSaveButton: true }];
            // return [...oldData, newMessage];
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
    const messageToSend = isTodoMode ? `투두리스트에 추가 : ${newMessage}` : newMessage;
    sendMessageMutation.mutate(messageToSend);
    textRef.current!.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleTodoMode = async () => {
    setIsTodoMode((prev) => !prev);
    const btnMessage = isTodoMode ? "일반 채팅으로 돌아갑니다." : "투두리스트를 작성하고 싶어요.";
    await sendMessageMutation.mutateAsync(btnMessage);
    // refetchMessages();
  };

  const handleSaveButton = () => {
    saveTodoMutation.mutate();
    queryClient.setQueryData<MessageWithSaveButton[] | undefined>(
      ["chat_sessions", aiType, sessionId],
      (oldData): MessageWithSaveButton[] => {
        if (!oldData) return [];
        return oldData.map((msg: MessageWithSaveButton) => ({ ...msg, showSaveButton: false }));
      }
    );
  };

  if (sessionIsLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <div>
      <div ref={chatContainerRef}>
        {isSuccessMessages && messages && messages.length > 0 ? (
          <ul>
            {messages?.map((message, index) => (
              <li key={index}>
                <span>{message.content ?? ""}</span>
                <span className="ml-1.5 text-xs text-gray-500">{formatTime(message.created_at)}</span>
                {message.showSaveButton && (
                  <button onClick={handleSaveButton} disabled={saveTodoMutation.isPending}>
                    {saveTodoMutation.isPending ? "저장 중..." : "저장 하기"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div>No messages yet.</div>
        )}
        <button onClick={toggleTodoMode} className="bg-black text-white">
          {isTodoMode ? "일반 채팅으로 돌아가기" : "투두리스트 작성하기"}
        </button>
        <div>
          <input
            ref={textRef}
            type="text"
            onKeyDown={handleKeyDown}
            placeholder={isTodoMode ? "할 일을 입력하세요..." : "메시지를 입력하세요..."}
            disabled={sendMessageMutation.isPending}
          />
          <button onClick={handleSendMessage} disabled={sendMessageMutation.isPending}>
            {sendMessageMutation.isPending ? "Sending..." : "Send"}
          </button>
        </div>
        <button onClick={() => endSession(sessionId)}>End Session</button>
      </div>
    </div>
  );
};

export default AssistantChat;
