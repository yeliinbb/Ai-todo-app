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
  user_auth: string;
};

export type TodoListType = {
  todo_id: string;
  todo_title: string;
  is_chat: boolean;
  created_at: string;
  todo_description: string;
  user_id: string;
  address: { lat: number; lng: number };
  event_datetime: string;
  is_done: boolean;
  is_all_day_event: boolean;
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

export type CategoryCode =
  | ""
  | "MT1"
  | "CS2"
  // | "PS3"
  // | "SC4"
  // | "AC5"
  // | "PK6"
  // | "OL7"
  // | "SW8"
  // | "BK9"
  // | "CT1"
  // | "AG2"
  // | "PO3"
  // | "AT4"
  // | "AD5"
  // | "FD6"
  | "CE7";
// | "HP8"
// | "PM9";

// export type MapType = "TRAFFIC" | "SKYVIEW" | "BICYCLE" | "ROADMAP" | "HYBRID" | "TERRAIN" | "OVERLAY";

export type DiaryMapSearchMarkerType = {
  position: { lat: number; lng: number };
  content: string;
  jibunAddress: string;
  roadAddress: string;
};


export type DiaryData = {
  diary_id: string;
  created_at: string;
  content: { title: string; content: string; diary_id: string; isFetching_todo: boolean }[];
  user_id: string;
};
