import { Auth } from "@/types/auth.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { email, password }: Auth = await request.json();

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 });
    }

    return NextResponse.json(signInData);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
