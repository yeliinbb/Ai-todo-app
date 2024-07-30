import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { date: string } }) {
  const supabase = createClient();
  return NextResponse.json({ message: "테스테스테스트,/diaries/route.ts입니다." });
}
