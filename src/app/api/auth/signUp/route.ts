import { Auth } from "@/types/auth.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { nickname, email, password, ai_type }: Omit<Auth, "passwordConfirm"> = await request.json();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          ai_type
        }
      }
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const { error: insertUserError } = await supabase.from("users").insert([
      {
        user_id: signUpData?.user?.id as string,
        nickname,
        email,
        ai_type
      }
    ]);

    if (insertUserError) {
      return NextResponse.json({ error: insertUserError.message }, { status: 400 });
    }

    return NextResponse.json(signUpData);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
