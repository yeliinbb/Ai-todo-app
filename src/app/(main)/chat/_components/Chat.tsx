"use client";
import { queryKeys } from "@/lib/queryKeys";
import { MESSAGES_ASSISTANT_TABLE } from "@/lib/tableNames";
import { Message } from "@/types/message.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const {
    data: messages,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages
  } = useQuery<Message[]>({
    queryKey: queryKeys.messages.assistant,
    queryFn: async () => {
      const response = await fetch("/api/chat");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
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
    // onSuccess: (data) => {
    //   console.log("data", data);
    //   queryClient.setQueryData(queryKeys.messages.all, (oldData = []) => {
    //     const updatedData = [...oldData, { ...data.userMessage, role: "user" }];
    //     // ai 응답이 있으면 추가
    //     if (data.aiMessage) {
    //       updatedData.push({ ...data.aiMessage, role: "ai" });
    //     }
    //     return updatedData;
    //   });
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.assistant });
    },
    onError: (error) => {
      console.error("Error sending message", error);
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel("messages_assistant")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: MESSAGES_ASSISTANT_TABLE
        },
        (payload: RealtimePostgresInsertPayload<Message>) => {
          console.log("New message received", payload.new);
          queryClient.setQueryData<Message[]>(queryKeys.messages.assistant, (oldData = []) => {
            const isExisting = oldData.some((msg) => msg.message_id === payload.new.message_id);
            if (isExisting) return oldData;

            if (payload.new.role === "user") return oldData;
            return [...oldData, payload.new as Message];
          });
        }
      )
      .subscribe();

    // cleanup 함수
    // 실시간 구독 취소
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

  return (
    <div>
      <div>{isSuccessMessages && messages?.map((message, index) => <div key={index}>{message.content}</div>)}</div>
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
      {/* <VoiceRecorder /> */}
    </div>
  );
};

export default Chat;
