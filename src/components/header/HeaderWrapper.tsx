"use client";
import { usePathname, useRouter } from "next/navigation";
import HeaderWithAlert from "./HeaderWithAlert";
import HeaderWithSearch from "./HeaderWithSearch";

const HeaderWrapper = () => {
  let pathname = usePathname();
  const hideHeaderPaths = ["write-diary", "diary-detail", "todo-detail", "diary-map"];
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.includes(path));
  const router = useRouter();
  const navigatePage = () => router.push("/my-page");
  if (shouldHideHeader) {
    return null;
  }
  pathname = pathname.slice(1);
  const isDiaryPage = pathname === "diary";
  const isChatPage = pathname.includes("chat");
  const isTodoPage = pathname === "todo-list";

  return isChatPage || isTodoPage ? (
    <HeaderWithSearch onClick={navigatePage} />
  ) : (
    <HeaderWithAlert className="bg-fai-100" onClick={navigatePage} />
  );
};

export default HeaderWrapper;
