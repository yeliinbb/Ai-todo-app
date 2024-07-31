import { TodoListType } from "@/types/diary.type";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { date: string; userId: string } }) {
  const supabase = createClient();

  const { date, userId } = params;
  try {
    // date 값이 없을 때 현재 날짜를 기본값으로 설정
    const searchDate = date ? new Date(date) : new Date();
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data as TodoListType[]); // 데이터 반환
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
