import { getCurrentDate } from "@/lib/utils/getCurrentDate";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    email: string;
  };
};

export async function GET(request: NextRequest, params: Params) {
  const supabase = createClient();
  const {
    params: { email }
  } = params;

  const currentDate: string = getCurrentDate();

  // 오늘의 투두(전체) 가져오기
  const { data: totalTodoData, error: totalTodoError } = await supabase
    .from("todos")
    .select("event_datetime")
    .eq("user_id", email)
    .gte("event_datetime", `${currentDate}T00:00:00Z`)
    .lt("event_datetime", `${currentDate}T23:59:59Z`);

  if (totalTodoError) {
    return NextResponse.json({ error: `Error fetching total todos: ${totalTodoError.message}` }, { status: 500 });
  }

  // 오늘의 투두 중에서 is_done이 true인 투두 가져오기
  const { data: doneTodoData, error: doneTodoError } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", email)
    .eq("is_done", true)
    .gte("event_datetime", `${currentDate}T00:00:00Z`)
    .lt("event_datetime", `${currentDate}T23:59:59Z`);

  if (doneTodoError) {
    return NextResponse.json({ error: `Error fetching done todos: ${doneTodoError.message}` }, { status: 500 });
  }

  if (totalTodoData === null || doneTodoData === null) {
    return NextResponse.json({ error: "Failed to fetch todo data." }, { status: 500 });
  }

  const todayTodo = {
    total: totalTodoData?.length as number,
    done: doneTodoData?.length as number
  };

  return NextResponse.json(todayTodo);
}
