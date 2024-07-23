"use client";
import { queryKeys } from "@/lib/queryKeys";
import { MESSAGES_FRIEND_TABLE } from "@/lib/tableNames";
import { MessageFriend } from "@/types/friend.type";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

// 메시지를 시간별로 그룹화하는 함수
const groupMessagesByHour = (messages: MessageFriend[]) => {
  const groups: { [key: string]: MessageFriend[] } = {};
  const now = new Date();

  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    const hoursDiff = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= 1) {
      const key = messageDate.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(message);
    }
  });

  return groups;
};

// 시간을 포맷하는 함수
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Chat = () => {
  const supabase = createClient();
  const textRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간을 주기적으로 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // 1분마다 업데이트
    return () => clearInterval(timer);
  }, []);

  const {
    data: messages_friend,
    isPending: isPendingMessages,
    isSuccess: isSuccessMessages
  } = useQuery<MessageFriend[]>({
    queryKey: queryKeys.messages.friend,
    queryFn: async () => {
      const response = await fetch("/api/chat_friend");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const response = await fetch("/api/chat_friend", {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.friend });
    },
    onError: (error) => {
      console.error("Error sending message", error);
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel("messages_friend")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: MESSAGES_FRIEND_TABLE
        },
        (payload: RealtimePostgresInsertPayload<MessageFriend>) => {
          console.log("New message received", payload.new);
          queryClient.setQueryData<MessageFriend[]>(queryKeys.messages.friend, (oldData = []) => {
            const isExisting = oldData.some((msg) => msg.message_id === payload.new.message_id);
            if (isExisting) return oldData;

            if (payload.new.role === "user") return oldData;
            return [...oldData, payload.new as MessageFriend];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  const handleSendMessage = async () => {
    if (!textRef.current || !textRef.current.value.trim() || sendMessageMutation.isPending) {
      return;
    }
    const newMessage = textRef.current.value;
    sendMessageMutation.mutate(newMessage);
    textRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const groupedMessages = isSuccessMessages ? groupMessagesByHour(messages_friend!) : {};

  return (
    <div>
      <div>
        {Object.entries(groupedMessages).map(([hour, messages], groupIndex) => (
          <div key={hour}>
            {groupIndex > 0 && <hr />} {/* 각 그룹 사이에 구분선 추가 */}
            {messages.map((message, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <span>{message.content}</span>
                <span style={{ fontSize: "0.8em", color: "gray", marginLeft: "10px" }}>
                  {formatTime(new Date(message.created_at))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
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
    </div>
  );
};

export default Chat;
