import { getDateTime } from "@/lib/utils/getDateTime";
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

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  console.log(getCurrentDate());

  //const {data: totalTodoData, error} = await supabase.from("todos").
}
