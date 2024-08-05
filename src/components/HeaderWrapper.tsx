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

  return pathname === "diary" || pathname === "chat" ? <HeaderWithAlert /> : <HeaderWithSearch />;
};

export default HeaderWrapper;
