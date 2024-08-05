// 세션 목록 및 생성을 위한 라우트
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const aiType = searchParams.get("aiType");

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase.from(CHAT_SESSIONS).select("*").eq("user_id", user.id);

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

export const POST = async (request: NextRequest, response: NextResponse) => {
  const supabase = createClient();

  try {
    const { aiType } = await request.json();

    if (!aiType) {
      return NextResponse.json({ error: "AI Type is required" }, { status: 400 });
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error: insertError } = await supabase
      .from(CHAT_SESSIONS)
      .insert({ ai_type: aiType, summary: "새로운 대화", user_id: user.id })
      .select()
      .single();
    if (insertError) {
      console.log("Error inserting chat sessions", insertError);
      throw insertError;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST :", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
};
