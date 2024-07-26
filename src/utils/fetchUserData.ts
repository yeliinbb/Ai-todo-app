import { createClient } from "./supabase/client";

export const fetchUserData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error("유저 데이터 조회 실패");
  return data;
};
