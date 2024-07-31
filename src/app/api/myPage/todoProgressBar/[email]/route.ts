import { getCurrentDate } from "@/lib/utils/getCurrentDate";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

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

  //const {data: totalTodoData, error} = await supabase.from("todos").
}
