// 세션 목록 및 생성을 위한 라우트
import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const aiType = searchParams.get("aiType");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseQuery = (query: any) => {
    return query.eq("user_id", user.id).not("summary", "is", null).not("updated_at", "is", null);
  };

  let countQuery = baseQuery(supabase.from(CHAT_SESSIONS).select("*", { count: "exact", head: true }));

  if (aiType) {
    countQuery = countQuery.eq("ai_type", aiType);
  }
  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  // 실제 데이터 가져오기
  let query = baseQuery(supabase.from(CHAT_SESSIONS).select("*"));

  if (aiType) {
    query = query.eq("ai_type", aiType);
  }

  query = query.order("updated_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;

  console.log("count", count);
  if (error || !data) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const hasNextPage = page < totalPages;
  // console.log("data", data);
  // console.log("page", page);
  // console.log("totalPages", totalPages);
  // console.log("nextPage", nextPage);
  // console.log("count", count);
  return NextResponse.json({ data, page, totalPages, nextPage, hasNextPage });
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

    // const today = new Date().toISOString().split("T")[0];

    // const result = await supabase
    //   .from(CHAT_SESSIONS)
    //   .select("*", { count: "exact", head: true })
    //   .eq("user_id", user.id)
    //   .gte("created_at", today);

    // const count = result.count;
    // const countError = result.error;

    // if (countError) {
    //   console.error("Error counting sessions :", countError);
    //   throw countError;
    // }

    // if (count && count > 6) {
    //   return NextResponse.json({ error: "Daily session limit reached" }, { status: 429 });
    // }

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
