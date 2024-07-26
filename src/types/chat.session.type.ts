import { Tables } from "./supabase";

export type ChatSession = Tables<"chat_sessions">;

export type Message = {
  role: "user" | "assistant" | "friend" | "system";
  content: string;
  created_at: string;
};

export type MessageWithSaveButton = Message & {
  showSaveButton?: boolean;
};

export type AIType = "assistant" | "friend";

export type Chat = {
  session_id: string;
  user_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  ai_type: AIType;
};
