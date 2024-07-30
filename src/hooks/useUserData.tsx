import { fetchUserData } from "@/utils/fetchUserData";
import { useQuery } from "@tanstack/react-query";

export const useUserData = () => {
  return useQuery({ queryKey: ["user"], queryFn: fetchUserData });
};
