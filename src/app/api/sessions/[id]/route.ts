// 개별 세션 관리를 위한 동적 라우트
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id: sessionId } = params;

  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    const { data, error } = await supabase.from(CHAT_SESSIONS).select("*").eq("session_id", sessionId).single();

    if (error || !data) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching session", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id: sessionId } = params;

  if (!sessionId) {
    return NextResponse.json({ error: "Session Id is required" }, { status: 400 });
  }

  try {
    const { error } = await supabase.from(CHAT_SESSIONS).delete().eq("session_id", sessionId);

    if (error) throw error;

    return NextResponse.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending session", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
};
