import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  console.log(origin, next);

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user information:", userError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      const user = userData.user as User;

      const { data: userId, error: userIdError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      // users 테이블에 사용자 정보 삽입
      // userID가 겹치면(유일하지 않으면) insert 되지 않음
      if (!userId) {
        const { data, error: insertError } = await supabase.from("users").insert([
          {
            user_id: user.id,
            email: user.user_metadata.email,
            nickname: user.user_metadata.full_name,
            isOAuth: true
          }
        ]);

        if (insertError) {
          console.error("Error inserting user information:", insertError.message);
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }
      }

      return NextResponse.redirect(`${origin}${next}/home`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
