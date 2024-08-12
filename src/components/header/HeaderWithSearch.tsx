"use client";
import Link from "next/link";
import CloseIcon from "../../assets/x.svg";
import { usePathname } from "next/navigation";
import SearchIcon from "../../assets/search.svg";
import NotificationsIcon from "../../assets/bell.alert.svg";
import useSideNavStore from "@/store/useSideNavStore";
import CommonBtn from "../CommonBtn";
import Logo from "../Logo";

interface HeaderWithSearchProps {
  className?: string;
}

const HeaderWithSearch = ({ className }: HeaderWithSearchProps) => {
  const { toggleSideNav } = useSideNavStore();
  const pathName = usePathname();
  const isTodoListPage = pathName.includes("todo-list");
  const isChatMainPage = pathName === "/chat";
  const isFai = pathName.includes("friend");

  const handleNotificationClick = () => {
    alert("아직 준비 중인 기능입니다!");
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 flex flex-shrink-0 justify-between items-center h-[4.5rem] px-4 py-4${className}`}
    >
      <CommonBtn icon={<SearchIcon />} onClick={toggleSideNav} />
      {isTodoListPage || isChatMainPage ? <Logo /> : <Logo isFai={isFai} />}
      {isTodoListPage || isChatMainPage ? (
        <CommonBtn icon={<NotificationsIcon />} onClick={handleNotificationClick} />
      ) : (
        <Link href={`/chat`}>
          <CommonBtn icon={<CloseIcon />} />
        </Link>
      )}
    </div>
  );
};

export default HeaderWithSearch;
