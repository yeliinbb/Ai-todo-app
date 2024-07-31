import { nicknameReg } from "@/lib/utils/auth/authValidation";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { newNickname, userId, isOAuth } = await request.json();

  // if (!nicknameReg.test(newNickname)) {
  //   return NextResponse.json({ error: "사용 불가능한 닉네임입니다." }, { status: 400 });
  // }

  // 소셜로그인 => user_name
  if (isOAuth) {
    const { data: success, error: updateError } = await supabase.auth.updateUser({ data: { full_name: newNickname } });
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
