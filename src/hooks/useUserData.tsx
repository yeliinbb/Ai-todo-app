// 일단 예시로 넣어둔 파일입니다.

import { fetchUserData } from "@/utils/fetchUserData";
import { useQuery } from "@tanstack/react-query";

export const useUserData = () => {
  return useQuery({ queryKey: ["user"], queryFn: fetchUserData });
};
