"use client";
import { usePathname } from "next/navigation";
import NavigationBar from "./NavigationBar";

const NavBarWrapper = () => {
  const pathname = usePathname();
  const hideNavPaths = ["write-diary", "diary-detail", "todo-detail", "assistant", "friend", "diary-map"];
  const shouldHideNav = hideNavPaths.some((path) => pathname.includes(path));

  if (shouldHideNav) {
    return null;
  }

  return (
    <>
      <NavigationBar />
    </>
  );
};

export default NavBarWrapper;
