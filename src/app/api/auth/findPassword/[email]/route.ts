import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    email: string;
  };
};

export async function GET(request: NextRequest, params: Params) {
  const supabase = createClient();
  const {
    params: { email }
  } = params;

  try {
    const { data, error } = await supabase.from("users").select("*").eq("isOAuth", false);

    if (error) {
      console.error("Error getting email data:", error.message);
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    const isEmailExists = data?.find((user) => user.email === email);
    if (!isEmailExists) {
      return NextResponse.json({ isEmailExists: false });
    }

    return NextResponse.json({ isEmailExists: true });
  } catch (error) {
    console.log("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
