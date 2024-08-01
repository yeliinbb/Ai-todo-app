"use client";
import { queryKeys } from "@/lib/queryKeys";
import openai from "@/lib/utils/openaiClient";
import { Message } from "@/types/message.type";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);

  

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
        (payload) => {
          setMessages((currentMessages) => [...currentMessages, payload.new as Message]);
        }
      )
      .subscribe();

    // cleanup 함수
    // 실시간 구독 취소
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);



  const handleSendMessage = async () => {
    if (!textRef.current && !textRef.current!.value.trim() && isLoading && textRef.current !== null) {
      return;
    }
    const newMessage = textRef.current!.value;
    setIsLoading(true);

    // 사용자 메시지 저장
    const { data: userData, error: userError } = await supabase
      .from("messages")
      .insert({ role: "user", content: newMessage })
      .select();
    if (userError) {
      console.error("Error sending user message", userError);
      setIsLoading(false);
      return;
    }
    textRef.current!.value = "";

    try {
      //openAI 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: newMessage }]
      });
      console.log("completion", completion);
      const aiResponse = completion.choices[0].message.content;

      // AI 응답 저장
      const { error: aiError } = await supabase.from("messages").insert({ role: "ai", content: aiResponse });
      if (aiError) console.error("Error sending AI message", aiError);
    } catch (error) {
      console.error("Error with OpenAI API :", error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.message_id}>{message.content}</div>
        ))}
      </div>
      <div>
        <input
          ref={textRef}
          type="text"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      {/* <VoiceRecorder /> */}
    </div>
  );
};

export default Chat;
