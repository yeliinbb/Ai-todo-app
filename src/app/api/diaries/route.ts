import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface Diary {
  date: Date;
}

export async function GET(request: Request, { params }: { params: { date: string } }) {
  const supabase = createClient();
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      return NextResponse.json({ error: sessionError });
    }
    const userId = sessionData.session.user.id;
    console.log('================================')
    console.log(userId)
    console.log('================================')
    const { data: diaryAllData, error: diaryError } = await supabase
      .from("diaries")
      .select("created_at")
      .eq("user_auth", userId);

    if (diaryError) {
      return NextResponse.json({ error: "diary 전체 데이터 가져오는과중 오류 발생했습니다." });
    }
    console.log('================================')
    console.log(diaryAllData)
    console.log('================================')

    const diaryDates:Diary[] = diaryAllData?.map((diary) => ({
      ...diary,
      date: new Date(diary.created_at)
    }));

    return NextResponse.json(diaryDates);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in GET :", error);
      return NextResponse.json({ error: "데이터 불러오는과정중 오류 발생했습니다." + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "데이터 불러오는과정중 예상치 못한 오류 발생했습니다." }, { status: 500 });
  }
}
