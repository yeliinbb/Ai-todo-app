"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu } from "react-icons/io5";

interface chatHeaderProps {
  toggleSideNav: () => void;
}

const ChatHeader = ({ toggleSideNav }: chatHeaderProps) => {
  const pathName = usePathname();
  // console.log(pathName);
  const chatName = pathName.includes("assistant") ? "비서 Pai" : "친구 Fai";

  return (
    <div className="flex justify-between items-center h-[4.5rem] px-4 py-2">
      <button
        onClick={toggleSideNav}
        className="rounded-full border-gray-200 border-solid border-[1px] w-14 h-14 flex justify-center items-center"
      >
        <IoMenu />
      </button>
      <span className={`${chatName === "비서 Pai" ? "text-pai-400" : "text-fai-500"} text-xl font-bold`}>
        {chatName}
      </span>
      <Link href={"http://localhost:3000/chat"}>
        <button className="rounded-full border-gray-200 border-solid border-[1px] w-14 h-14 flex justify-center items-center">
          X
        </button>
      </Link>
    </div>
  );
};

export default ChatHeader;
