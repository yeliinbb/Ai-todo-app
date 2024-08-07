import { TodoListType } from "@/types/diary.type";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { date: string; id: string } }) {
  const supabase = createClient();

  const { date, id } = params;

  try {
    const searchDate = date ? new Date(date) : new Date();
    const startDate = new Date(searchDate);
    // startDate.setUTCHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    // endDate.setUTCHours(23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", id)
      .gte("event_datetime", startDate.toISOString())
      .lt("event_datetime", endDate.toISOString())
      .order("event_datetime", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data as TodoListType[]);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching todos data:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error("Unexpected error occurred:", err);
      return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
  }
}
