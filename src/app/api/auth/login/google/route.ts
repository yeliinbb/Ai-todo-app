import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const SITE_URL = "http://localhost:3000";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${SITE_URL}/api/auth/login/callback`
        // queryParams: {
        //   access_type: "offline",
        //   prompt: "consent"
        // }
      }
    });
    console.log(1);
    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 });
    }

    return NextResponse.json(signInData);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
