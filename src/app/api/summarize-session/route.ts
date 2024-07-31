import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { summarizeChat } from "../lib/summarizeChat";
import { CHAT_SESSIONS } from "@/lib/tableNames";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const { sessionId, messages } = await request.json();
    const summary = await summarizeChat(messages);
    const { data, error } = await supabase.from(CHAT_SESSIONS).update({ summary }).eq("session_id", sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in summarize-session : ", error);
    return NextResponse.json({ error: "Failed to summarize and update session" });
  }
};
