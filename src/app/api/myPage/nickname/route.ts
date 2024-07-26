import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { newNickname, userId } = await request.json();

  console.log(newNickname, userId);
  // TODO: 리턴 데이터 확인
  const { data, error } = await supabase.from("users").update({ nickname: newNickname }).eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
