import { Tables } from "./supabase";

export type ChatSession = Tables<"chat_sessions">;

export type Message = {
  role: "user" | "assistant" | "friend" | "system";
  content: string;
  created_at: string;
};

export type MessageWithButton = Message & {
  showSaveButton?: boolean;
  isResetButton?: boolean;
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

export type ChatTodoItem = {
  title?: string;
  description?: string;
  time?: string | null | undefined;
  location?: string;
  latitude?: number;
  longitude?: number;
};

export type RecommendItem = {
  title?: string;
  description?: string;
};

export type ApiResponse = {
  type: "todo" | "recommend" | "general" | "add";
  content: {
    todo_list?: ChatTodoItem[];
    added_items?: ChatTodoItem[];
    recommend_list?: RecommendItem[];
    message?: string;
  };
};
