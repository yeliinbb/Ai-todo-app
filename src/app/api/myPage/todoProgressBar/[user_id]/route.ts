import { getCurrentDate } from "@/lib/utils/getCurrentDate";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

type Params = {
  params: {
    user_id: string;
  };
};

export async function GET(request: NextRequest, params: Params) {
  const supabase = createClient();
  const {
    params: { user_id }
  } = params;

  const currentDate: string = getCurrentDate();

  const startDate = dayjs.tz(`${currentDate} 00:00:00`, "Asia/Seoul");
  const endDate = dayjs.tz(`${currentDate} 23:59:59`, "Asia/Seoul");

  // 오늘의 투두(전체) 가져오기
  const { data: totalTodoData, error: totalTodoError } = await supabase
    .from("todos")
    .select("event_datetime")
    .eq("user_id", user_id)
    .gte("event_datetime", startDate.toISOString())
    .lt("event_datetime", endDate.toISOString());

  if (totalTodoError) {
    return NextResponse.json({ error: `Error fetching total todos: ${totalTodoError.message}` }, { status: 500 });
  }

  // 오늘의 투두 중에서 is_done이 true인 투두 가져오기
  const { data: doneTodoData, error: doneTodoError } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user_id)
    .eq("is_done", true)
    .gte("event_datetime", startDate.toISOString())
    .lt("event_datetime", endDate.toISOString());

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
