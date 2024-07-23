import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  console.log(code, next);
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log(user);

      if (userError) {
        console.error("Error getting user information:", userError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      // users 테이블에 사용자 정보 삽입
      // const { data, error: insertError } = await supabase.from("users").insert([
      //   {
      //     user_id: user.id as string,
      //     email: user.user_metadata.email as string,
      //     nickname: user.user_metadata.full_name as string,
      //     ai_type: "Pai"
      //   }
      // ]);

      // if (insertError) {
      //   console.error("Error inserting user information:", insertError.message);
      //   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      // }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
