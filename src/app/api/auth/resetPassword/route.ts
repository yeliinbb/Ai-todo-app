import { createClient } from "@/utils/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/reset-password";

  if (token_hash && type) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (error) {
      console.log("에러", error);
      redirect("/");
    }

    if (data && !error) {
      // console.log("로그인 데이터", data);
      redirect(next);
    }
  }

  redirect("/reset-password");
}

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { password } = await request.json();
  try {
    const { data, error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      console.error("Error updating password:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
