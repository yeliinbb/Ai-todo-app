import { Tables } from "./supabase";

export type Diary = Tables<"diaries">;

export type DiaryEntry = {
  diary_id: string;
  created_at: string;
  content: {
    title: string;
    isDone: boolean;
    address: {
      lat: string;
      lng: string;
    };
    content: string;
  }[];
  user_id: string;
};
