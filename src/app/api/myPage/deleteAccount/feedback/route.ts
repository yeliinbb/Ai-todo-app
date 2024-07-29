import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { content } = await request.json();
  const { data, error } = await supabase.from("feedback").insert({ content }).select();

  if (error) {
    console.error("Supabase Insert Error: ", error);
    return NextResponse.json({ error: "피드백 등록 실패" }, { status: 400 });
  }
  return NextResponse.json(data);
}
