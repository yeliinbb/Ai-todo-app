"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const hideHeaderPaths = ["write-diary", "diary-detail", "todo-detail", "assistant", "friend", "diary-map"];
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.includes(path));

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
