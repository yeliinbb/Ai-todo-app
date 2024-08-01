"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu } from "react-icons/io5";
import Menu from "../../../../assets/menu.svg";
import Close from "../../../../assets/x.svg";

interface chatHeaderProps {
  toggleSideNav: () => void;
}

const ChatHeader = ({ toggleSideNav }: chatHeaderProps) => {
  const pathName = usePathname();
  // console.log(pathName);
  const chatName = pathName.includes("assistant") ? "비서 PAi" : "친구 FAi";

  return (
    <div className="flex justify-between items-center h-[4.5rem] px-4 py-2 bg-gray-100 mb-2">
      <button
        onClick={toggleSideNav}
        className="rounded-full bg-whiteTrans-wh56 backdrop-blur-xl border-grayTrans-20032 border-solid border-1 w-14 h-14 flex justify-center items-center"
      >
        <Menu />
      </button>
      <span className={`${chatName === "비서 PAi" ? "text-pai-400" : "text-fai-500"} text-xl font-bold`}>
        {chatName}
      </span>
      <Link href={"http://localhost:3000/chat"}>
        <button className="rounded-full bg-whiteTrans-wh56 backdrop-blur-xl border-grayTrans-20032 border-solid border-1 w-14 h-14 flex justify-center items-center">
          <Close />
        </button>
      </Link>
    </div>
  );
};

export default ChatHeader;
