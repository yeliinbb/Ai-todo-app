import { CHAT_SESSIONS } from "@/lib/tableNames";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();
  const sessionId = cookies().get("sessionId")?.value;

  //   const {data : {user} , error : authError} = await supabase.auth.getUser();
  //   if(authError || !user) {
  //     return NextResponse.json({error : "Unauthorized"}, {status : 401})
  //   }

  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from(CHAT_SESSIONS)
      .select("*")
      .eq("session_id", sessionId)
      // .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // await supabase.from(CHAT_SESSIONS).update({ updated_at: new Date().toISOString() }).eq("session_id", sessionId);

    return NextResponse.json({ sessionId, valid: true });
  } catch (error) {
    console.error("Error checking session", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
};

export const POST = async () => {
  const supabase = createClient();

  //   const {data : {user} , error : authError} = await supabase.auth.getUser();
  //   if(authError || !user) {
  //     return NextResponse.json({error : "Unauthorized"}, {status : 401})
  //   }

  try {
    const { data, error } = await supabase
      .from(CHAT_SESSIONS)
      .insert({})
      // .insert({user_id : user.id}) // user_id 있는 경우에 사용
      .select()
      .single();

    if (error) throw error;

    cookies().set("sessionId", data.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/" // 웹사이트 모든 경로에서 접근 가능
    });
    return NextResponse.json({ sessionId: data.session_id });
  } catch (error) {
    console.error("Error creating session", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
};

export const DELETE = async () => {
  const supabase = createClient();
  const sessionId = cookies().get("sessionId")?.value;

  //   const {data : {user} , error : authError} = await supabase.auth.getUser();
  //   if(authError || !user) {
  //     return NextResponse.json({error : "Unauthorized"}, {status : 401})
  //   }

  if (!sessionId) {
    return NextResponse.json({ message: "No session to end" }, { status: 400 });
  }

  try {
    await supabase.from(CHAT_SESSIONS).delete().eq("session_id", sessionId);
    // .eq("user_id", user.id);

    cookies().delete("sessionId");

    return NextResponse.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending session", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
};
