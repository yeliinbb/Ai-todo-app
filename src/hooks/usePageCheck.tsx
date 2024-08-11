import { usePathname } from "next/navigation";

const usePageCheck = () => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isChatPage = pathname.startsWith("/chat");
  const isTodoPage = pathname.startsWith("/todo");
  const isDiaryPage = pathname.startsWith("/diary");
  const isPaiPage = pathname.includes("assistant");
  const isFaiPage = pathname.includes("friend");

  return {
    isLoginPage,
    isChatPage,
    isTodoPage,
    isDiaryPage,
    isPaiPage,
    isFaiPage
  };
};

export default usePageCheck;
