"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useClickNavigateItem = (url: string) => {
  const router = useRouter();
  const handleNavigateItem = useCallback(() => {
    router.push(url);
  }, [router, url]);
  return { handleNavigateItem };
};

export default useClickNavigateItem;
