"use client";

import useChatSession from "@/hooks/useChatSession";
import { queryKeys } from "@/lib/queryKeys";
import { CHAT_SESSIONS, MESSAGES_ASSISTANT_TABLE } from "@/lib/tableNames";
import { AIType, Message } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface AssistantChatProps {
  sessionId: string;
}

type MutationContext = {
  previousMessages: Message[] | undefined;
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
  } = useQuery<Message[]>({
    queryKey: ["chat_sessions", aiType, sessionId],
    queryFn: async () => {
      if (!sessionId) return;
      const response = await fetch(`/api/chat/${aiType}/${sessionId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data", data);
      return data[0].messages || [];
    },
    enabled: !!sessionId
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("sendMessageMutation data", data);
      return data.message;
    },
    onMutate: async (newMessage): Promise<MutationContext> => {
      const previousMessages = queryClient.getQueryData<Message[]>(["chat_sessions", aiType, sessionId]);
      queryClient.setQueryData<Message[]>(["chat_sessions", aiType, sessionId], (oldData) => [
        ...(oldData || []),
        { role: "user", content: newMessage, created_at: new Date().toISOString() }
      ]);
      return { previousMessages };
    },
    onError: (error, newMessage, context) => {
      console.error("Error sending message", error);
      if (context?.previousMessages) {
        queryClient.setQueryData(["chat_sessions", aiType, sessionId], context?.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chat_sessions", aiType, sessionId] });
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
          queryClient.setQueryData<Message[]>(["chat_sessions", aiType, sessionId], (oldData = []) => {
            const newMessage = payload.new as Message;

            if (oldData.some((msg) => msg.created_at === newMessage.created_at)) return oldData;
            return [...oldData, newMessage];
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
    refetchMessages();
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
              <li key={index}>{message.content ?? ""}</li>
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
