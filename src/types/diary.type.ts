import { Tables } from "./supabase";

export type Diary = Tables<"diaries">;

export type DiaryEntry = {
  diary_id: string;
  created_at: string;
  content: {
    diary_id: string;
    title: string;
    content: string;
  }[];
  user_id: string;
  isFetching_todo: boolean;
};

export type TodoListType = {
  todo_id: string;
  todo_title: string;
  content: string;
  created_at: string;
  todo_description: string;
  user_id: string;
  address: { lat: number; lng: number };
  event_datetime: string;
  is_done: boolean;
};
