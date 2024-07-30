import { NextResponse } from "next/server";

import { DiaryEntry } from "@/types/diary.type";
import { createClient } from "@/utils/supabase/server";

const user_id = "kimyong1@result.com";

export async function GET(request: Request, { params }: { params: { date: string } }) {
  const supabase = createClient();

  try {
    const { date } = params;
    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const searchDate = new Date(date);
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const { data: diaryData, error } = await supabase
      .from("diaries")
      .select("*")
      .eq("user_id", user_id)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error("Failed to fetch data from Supabase");
    }

    return NextResponse.json(
      (diaryData || []).map((entry) => ({
        diary_id: entry.diary_id,
        created_at: entry.created_at,
        content: entry.content,
        user_id: entry.user_id || ""
      }))
    );
  } catch (error) {
    console.error("Error fetching diary data:", error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
