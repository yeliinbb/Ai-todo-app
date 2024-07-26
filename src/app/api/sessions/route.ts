// 세션 목록 및 생성을 위한 라우트
import { CHAT_SESSIONS } from "@/lib/tableNames";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const aiType = searchParams.get("aiType");

  let query = supabase.from(CHAT_SESSIONS).select("*");

  if (aiType) {
    query = query.eq("ai_type", aiType);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error || !data) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const { aiType } = await request.json();

  if (!aiType) {
    return NextResponse.json({ error: "AI Type is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from(CHAT_SESSIONS).insert({ ai_type: aiType }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
