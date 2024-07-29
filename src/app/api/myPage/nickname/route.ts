import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { newNickname, userId, provider } = await request.json();

  console.log(newNickname, userId, provider);
  // 소셜로그인 => user_name
  if (provider !== "email") {
    const { data: success, error: updateError } = await supabase.auth.updateUser({ data: { user_name: newNickname } });
    if (success) {
      const { data, error } = await supabase.from("users").update({ nickname: newNickname }).eq("user_id", userId);
    }
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json(success);
  }

  // 이메일 로그인 => nickname
  const { data: success, error: updateError } = await supabase.auth.updateUser({ data: { nickname: newNickname } });
  if (success) {
    const { data, error } = await supabase.from("users").update({ nickname: newNickname }).eq("user_id", userId);
  }
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  return NextResponse.json(success);
}
