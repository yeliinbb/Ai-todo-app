import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { password } = await request.json();
  try {
    const { data, error } = await supabase.auth.updateUser({
      password
    });

    // TODO: 기존 비밀번호와 새로우 비밀번호가 같으면 에러 발생
    // {error: "New password should be different from the old password."}

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
