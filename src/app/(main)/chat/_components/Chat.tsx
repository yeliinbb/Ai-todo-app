"use client";
import { queryKeys } from "@/lib/queryKeys";
import openai from "@/lib/utils/openaiClient";
import { Message } from "@/types/message.type";
import { createClient } from "@/utils/supabase/client";
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
    queryKey: queryKeys.messages.all,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages"
        },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
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
    if (
      !textRef.current &&
      !textRef.current!.value.trim() &&
      sendMessageMutation.isPending &&
      textRef.current !== null
    ) {
      return;
    }
    const newMessage = textRef.current!.value;
    try {
      sendMessageMutation.mutate(newMessage);
      textRef.current!.value = "";
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <div>
      <div>
        {isSuccessMessages && messages?.map((message) => <div key={message.message_id}>{message.content}</div>)}
      </div>
      <div>
        <input
          ref={textRef}
          type="text"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
