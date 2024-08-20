"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import useSideNavStore from "@/store/useSideNavStore";
import CommonBtn from "../CommonBtn";
import Logo from "../Logo";
import usePageCheck from "@/hooks/usePageCheck";
import CloseIcon from "../icons/CloseIcon";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";

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
  const logoType = isFaiPage ? "fai" : "pai";

  if (shouldHideHeader) {
    return null;
  }

  const navigateToMyPage = () => router.push("/my-page");

  const getLeftButton = () => {
    if (isPaiPage || isFaiPage || isTodoPage || isChatPage) {
      return <CommonBtn icon={<SearchIcon />} onClick={toggleSideNav} />;
    }
    return <Logo type="main" />; // 또는 다른 기본 버튼
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
      return <Logo type="main" />;
    } else if (isFaiPage || isPaiPage) {
      return <Logo type={logoType} />;
    }
    return null;
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 flex flex-shrink-0 justify-between items-center h-[4.5rem] mobile:px-4 pt-2 desktop:py-4 desktop:h-[5.375rem] pb-5 bg-header-gradient desktop:px-14 ${className}`}
    >
      {getLeftButton()}
      {getMiddleButton()}
      {getRightButton()}
    </div>
  );
};

export default MainHeader;
