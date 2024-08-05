import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const VERCEL_URL = "https://ai-todo-app-beta.vercel.app/";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { email } = await request.json();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${VERCEL_URL}/login/reset-password`
    });

    if (error) {
      console.error("Error sending password reset email:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Password reset email data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
