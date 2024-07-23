"use client";
import { useSession } from "@/hooks/useSession";
import { queryKeys } from "@/lib/queryKeys";
import { CHAT_SESSIONS, MESSAGES_ASSISTANT_TABLE } from "@/lib/tableNames";
import { Message } from "@/types/chat.session.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const Chat = () => {
  const { sessionId, createSession, endSession, isLoading: sessionIsLoading } = useSession();
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: messages,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages
  } = useQuery<Message[]>({
    queryKey: ["chat_sessions", sessionId],
    queryFn: async () => {
      if (!sessionId) return;
      const response = await fetch("/api/chat");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!sessionId
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat_sessions", sessionId] });
    },
    onError: (error) => {
      console.error("Error sending message", error);
    }
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    if (!sessionId) {
      return;
    }

    const channel = supabase
      .channel("messages_assistant")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: CHAT_SESSIONS
        },
        (payload: RealtimePostgresInsertPayload<Message>) => {
          console.log("New message received", payload.new);
          queryClient.setQueryData<Message[]>(["chat_sessions", sessionId], (oldData = []) => {
            const isExisting = oldData.some(
              (msg) =>
                msg.content === payload.new.content &&
                msg.created_at === payload.new.created_at &&
                msg.role === payload.new.role
            );
            if (isExisting) return oldData;

            if (payload.new.role === "user") return oldData;
            return [...oldData, payload.new];
          });
        }
      )
      .subscribe();

    // cleanup 함수 : 실시간 구독 취소
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  const handleSendMessage = async () => {
    if (!textRef.current && !textRef.current!.value.trim() && sendMessageMutation.isPending) {
      return;
    }
    const newMessage = textRef.current!.value;
    sendMessageMutation.mutate(newMessage);
    textRef.current!.value = "";
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

  // if (!sessionId) {
  //   return (
  //     <div>
  //       <p>No active session. Start a session to chat.</p>
  //       <button onClick={createSession}>Start session</button>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div ref={chatContainerRef}>
        {sessionId ? (
          <ul>{isSuccessMessages && messages?.map((message, index) => <li key={index}>{message.content}</li>)}</ul>
        ) : (
          <div>
            <p>No active session. Start a session to chat.</p>
            <button onClick={createSession}>Start session</button>
          </div>
        )}
        <div>
          <input
            ref={textRef}
            type="text"
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sendMessageMutation.isPending}
          />
          <button onClick={handleSendMessage} disabled={sendMessageMutation.isPending}>
            {sendMessageMutation.isPending ? "Sending..." : "Send"}
          </button>
        </div>
        {sessionId ? <button onClick={endSession}>End Session</button> : null}
      </div>
    </div>
  );
};

export default Chat;
