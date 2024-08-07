"use client";
import { usePathname } from "next/navigation";
import HeaderWithAlert from "./HeaderWithAlert";
import HeaderWithSearch from "./HeaderWithSearch";

const HeaderWrapper = () => {
  let pathname = usePathname();
  const hideHeaderPaths = ["write-diary", "diary-detail", "todo-detail", "assistant", "friend", "diary-map"];
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.includes(path));

  if (shouldHideHeader) {
    return null;
  }
  pathname = pathname.slice(1);
  const isDiaryPage = pathname === "diary";
  const isChatPage = pathname === "chat";
  const isTodoPage = pathname === "todo-list";

  return isDiaryPage || isChatPage ? (
    <HeaderWithAlert className={isDiaryPage ? "bg-fai-100" : "bg-system-white"} />
  ) : (
    <HeaderWithSearch className={isTodoPage ? "bg-gray-100" : "bg-system-white"} />
  );
};

export default HeaderWrapper;
