"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import SearchIcon from "../../assets/search.svg";
import UserIcon from "../../assets/user.svg";
import CloseIcon from "../../assets/x.svg";
import useSideNavStore from "@/store/useSideNavStore";
import CommonBtn from "../CommonBtn";
import Logo from "../Logo";
import usePageCheck from "@/hooks/usePageCheck";

interface HeaderProps {
  className?: string;
}

const MainHeader = ({ className = "" }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSideNav } = useSideNavStore();
  const { isHomePage, isLoginPage, isChatPage, isTodoPage, isDiaryPage, isPaiPage, isFaiPage } = usePageCheck();
  const hideHeaderPaths = ["write-diary", "diary-detail", "todo-detail", "diary-map"];
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.includes(path));

  if (shouldHideHeader) {
    return null;
  }

  // const isDiaryPage = pathname === "/diary";
  // const isChatPage = pathname.includes("/chat");
  // const isTodoPage = pathname === "/todo-list";
  // const isChatMainPage = pathname === "/chat";
  // const isFai = pathname.includes("/friend");

  const navigateToMyPage = () => router.push("/my-page");

  const getLeftButton = () => {
    if (isPaiPage || isFaiPage || isTodoPage || isChatPage) {
      return <CommonBtn icon={<SearchIcon />} onClick={toggleSideNav} />;
    }
    return <Logo />; // 또는 다른 기본 버튼
  };

  const getRightButton = () => {
    if (isPaiPage || isFaiPage) {
      return (
        <Link href="/chat">
          <CommonBtn icon={<CloseIcon />} />
        </Link>
      );
    }
    return <CommonBtn icon={<UserIcon />} onClick={navigateToMyPage} />;
  };

  const getMiddleButton = () => {
    if (isTodoPage || isChatPage) {
      return <Logo />;
    } else if (isFaiPage || isPaiPage) {
      return <Logo isFai={isFaiPage} />;
    }
    return null;
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 flex flex-shrink-0 justify-between items-center h-[4.5rem] mobile:px-4 pt-2 pb-5 bg-header-gradient desktop:px-14 ${className}`}
    >
      {getLeftButton()}
      {getMiddleButton()}
      {getRightButton()}
    </div>
  );
};

export default MainHeader;
