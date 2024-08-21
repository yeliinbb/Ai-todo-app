import { NextResponse } from "next/server";
import { DiaryEntry } from "@/types/diary.type";
import { createClient } from "@/utils/supabase/server";
import { DIARY_TABLE } from "@/lib/constants/tableNames";

export async function GET(request: Request, { params }: { params: { date: string; id: string } }) {
  const supabase = createClient();

  try {
    const { date, id } = params;
    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    // const { data } = await supabase.auth.getSession();

    const searchDate = new Date(date);
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const { data: diaryData, error } = await supabase
      .from(DIARY_TABLE)
      .select("*")
      .eq("user_auth", id)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .order("created_at", { ascending: true })
      .single();

    if (error) {
      throw new Error("DB Error");
    }
    if (!diaryData) {
      throw new Error("No diary data found");
    }
    console.log('================================')
    console.log(diaryData)
    console.log('================================')
    return NextResponse.json(diaryData as DiaryEntry);
  } catch (error) {
    console.error("Error fetching diary data:", error);
    return NextResponse.json({ error: "서버로 요청중 예상치 못한 오류 발생" }, { status: 500 });
  }
}
