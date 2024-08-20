"use client";
import Link from "next/link";
import CloseIcon from "../../assets/x.svg";
import { usePathname } from "next/navigation";
import SearchIcon from "../../assets/search.svg";
import UserIcon from "../../assets/user.svg";
import useSideNavStore from "@/store/useSideNavStore";
import CommonBtn from "../CommonBtn";
import Logo from "../Logo";

interface HeaderWithSearchProps {
  className?: string;
  onClick?: () => void;
}

const HeaderWithSearch = ({ className, onClick }: HeaderWithSearchProps) => {
  const { toggleSideNav } = useSideNavStore();
  const pathName = usePathname();
  const isTodoListPage = pathName.includes("todo-list");
  const isChatMainPage = pathName === "/chat";
  const isFai = pathName.includes("friend");
  const logoType = isFai ? "fai" : "pai";
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 flex flex-shrink-0 justify-between items-center h-[4.5rem] desktop:h-[5.375rem] px-4 pt-2 pb-5 bg-header-gradient`}
    >
      <CommonBtn icon={<SearchIcon />} onClick={toggleSideNav} />
      {isTodoListPage || isChatMainPage ? <Logo type="main" /> : <Logo type={logoType} />}
      {isTodoListPage || isChatMainPage ? (
        <CommonBtn icon={<UserIcon />} onClick={onClick} />
      ) : (
        <Link href={`/chat`}>
          <CommonBtn icon={<CloseIcon />} />
        </Link>
      )}
    </div>
  );
};

export default HeaderWithSearch;
