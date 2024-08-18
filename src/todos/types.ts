import { LocationData } from "@/shared/LocationSelect/types";
import { Tables } from "../types/supabase";

export type TodoData = Tables<"todos">;

export type Todo = {
  todo_id: string;
  todo_title: string;
  todo_description?: string;
  created_at: string;
  event_datetime?: string;
  is_done: boolean;
  is_all_day_event: boolean;
  address: LocationData;
};
