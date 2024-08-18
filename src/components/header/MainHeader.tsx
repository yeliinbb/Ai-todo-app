"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import SearchIcon from "../../assets/search.svg";
import UserIcon from "../../assets/user.svg";
import CloseIcon from "../../assets/x.svg";
import useSideNavStore from "@/store/useSideNavStore";
import CommonBtn from "../CommonBtn";
import Logo from "../Logo";

interface HeaderProps {
  className?: string;
}

const MainHeader = ({ className = "" }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSideNav } = useSideNavStore();

  const hideHeaderPaths = ["write-diary", "diary-detail", "todo-detail", "diary-map"];
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.includes(path));

  if (shouldHideHeader) {
    return null;
  }

  const isDiaryPage = pathname === "/diary";
  const isChatPage = pathname.includes("/chat");
  const isTodoPage = pathname === "/todo-list";
  const isChatMainPage = pathname === "/chat";
  const isFai = pathname.includes("/friend");

  const navigateToMyPage = () => router.push("/my-page");

  const getLeftButton = () => {
    if (isDiaryPage) {
      return <Logo />;
    }
    if (isChatPage || isTodoPage) {
      return <CommonBtn icon={<SearchIcon />} onClick={toggleSideNav} />;
    }
    return null; // 또는 다른 기본 버튼
  };

  const getRightButton = () => {
    if (isTodoPage || isChatMainPage) {
      return <CommonBtn icon={<UserIcon />} onClick={navigateToMyPage} />;
    }
    if (isChatPage) {
      return (
        <Link href="/chat">
          <CommonBtn icon={<CloseIcon />} />
        </Link>
      );
    }
    return <CommonBtn icon={<UserIcon />} onClick={navigateToMyPage} />;
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 flex flex-shrink-0 justify-between items-center h-[4.5rem] mobile:px-4 pt-2 pb-5 bg-header-gradient desktop:px-14 ${className}`}
    >
      {getLeftButton()}
      {!isDiaryPage && (isTodoPage || isChatMainPage ? <Logo /> : <Logo isFai={isFai} />)}
      {getRightButton()}
    </div>
  );
};

export default MainHeader;
