import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { summarizeChat } from "../lib/chat/summarizeChat";
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const { sessionId, messages, aiType } = await request.json();
    const summary = await summarizeChat(messages, aiType);
    const { data, error } = await supabase.from(CHAT_SESSIONS).update({ summary }).eq("session_id", sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in summarize-session : ", error);
    return NextResponse.json({ error: "Failed to summarize and update session" });
  }
};
