import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SECRET_SUPABASE_SERVICE_ROLE_KEY!
);

const adminAuthClient = supabase.auth.admin;

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  const { data, error } = await adminAuthClient.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: "SUCCESS" });
}
