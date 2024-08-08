"use client";
import { usePathname } from "next/navigation";
import HeaderWithAlert from "./HeaderWithAlert";
import HeaderWithSearch from "./HeaderWithSearch";

const HeaderWrapper = () => {
  let pathname = usePathname();
  const hideHeaderPaths = ["write-diary", "diary-detail", "todo-detail", "diary-map"];
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.includes(path));

  if (shouldHideHeader) {
    return null;
  }
  pathname = pathname.slice(1);
  const isDiaryPage = pathname === "diary";
  const isChatPage = pathname.includes("chat");
  const isTodoPage = pathname === "todo-list";

  return isChatPage || isTodoPage ? (
    <HeaderWithSearch className={isTodoPage ? "bg-gray-100" : "bg-system-white"} />
  ) : (
    <HeaderWithAlert className="bg-fai-100" />
  );
};

export default HeaderWrapper;
