import { Tables } from "./supabase";

export type ChatSession = Tables<"chat_sessions">;

export type Message = {
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type Chat = {
  session_id: string;
  user_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  ai_mode: string | null;
};
