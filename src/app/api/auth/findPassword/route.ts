import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("users").select("*").eq("isOAuth", false);
    const emailList = data?.map((user) => user.email);

    if (error) {
      console.error("Error getting email data:", error.message);
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json(emailList);
  } catch (error) {
    console.log("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { email } = await request.json();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/login/reset-password"
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
