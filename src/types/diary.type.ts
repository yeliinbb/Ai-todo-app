import { Tables } from "./supabase";

export type Diary = Tables<"diaries">;

export type DiaryEntry = {
  diary_id: string;
  created_at: string;
  content: {
    diary_id: string;
    title: string;
    content: string;
    isFetching_todo: boolean;
  }[];
  user_id: string;
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

export type Position = {
  lat: number;
  lng: number;
};

export interface KakaoMapPageProps {
  initialPosition: Position;
  todoId: string;
}

export type UpdateTOdoAddressType = {
  todoId: string;
  lat: number;
  lng: number;
};

export type DiaryContentType = {
  content: string;
  diary_id: string;
  title: string;
  isFetching_todo: boolean;
};

export type SaveDiaryEntryType = {
  selectedDate: string;
  diaryTitle: string;
  htmlContent: string;
  diaryId: string;
  fetchingTodos: boolean;
  userId: string;
};
