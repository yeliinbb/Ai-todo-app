"use client";
import { usePathname } from "next/navigation";

const usePageCheck = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/home";
  const isLoginPage = pathname === "/login";
  const isChatPage = pathname === "/chat";
  const isTodoPage = pathname.startsWith("/todo");
  const isDiaryPage = pathname.startsWith("/diary");
  const isPaiPage = pathname.includes("assistant");
  const isFaiPage = pathname.includes("friend");

  return {
    isHomePage,
    isLoginPage,
    isChatPage,
    isTodoPage,
    isDiaryPage,
    isPaiPage,
    isFaiPage
  };
};

export default usePageCheck;
