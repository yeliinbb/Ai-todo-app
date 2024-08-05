"use client";
import Link from "next/link";
import CloseIcon from "..//assets/x.svg";
import { usePathname } from "next/navigation";
import useSideNavStore from "../store/useSideNavStore";
import MenuIcon from "../assets/menu.svg";
import SearchIcon from "../assets/search.svg";
import NotificationsIcon from "../assets/bell.alert.svg";
import Logo from "./Logo";
import CommonBtn from "./CommonBtn";

const HeaderWithSearch = () => {
  const { toggleSideNav } = useSideNavStore();
  const pathName = usePathname();
  const chatName = pathName.includes("assistant") ? "비서 PAi" : "친구 FAi";
  const isTodoListPage = pathName.includes("todo-list");

  return (
    <div className="flex flex-shrink-0 justify-between items-center h-[4.5rem] px-4 py-4 bg-gray-100 ">
      <CommonBtn icon={isTodoListPage ? <SearchIcon /> : <MenuIcon />} onClick={toggleSideNav} />
      {isTodoListPage ? (
        <Logo />
      ) : (
        <span className={`${chatName === "비서 PAi" ? "text-pai-400" : "text-fai-500"} text-xl font-bold`}>
          {chatName}
        </span>
      )}

      {isTodoListPage ? (
        <CommonBtn icon={<NotificationsIcon />} />
      ) : (
        <Link href={"http://localhost:3000/chat"}>
          <CommonBtn icon={<CloseIcon />} />
        </Link>
      )}
    </div>
  );
};

export default HeaderWithSearch;
