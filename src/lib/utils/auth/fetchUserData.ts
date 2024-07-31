import { createClient } from "../../../utils/supabase/client";

export const fetchUserData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  const userId = data?.user?.id as string;
  if (data) {
    const { data: loggedInUser, error: loggedInUserError } = await supabase
      .from("users")
      .select()
      .eq("user_id", userId)
      .single();

    if (loggedInUserError) {
      throw new Error("유저 테이블 데이터 조회 실패");
    }
    return loggedInUser;
  }

  if (error) throw new Error("유저 데이터 조회 실패");
  return data;
};
