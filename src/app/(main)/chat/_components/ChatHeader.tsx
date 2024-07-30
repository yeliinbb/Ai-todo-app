"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu } from "react-icons/io5";

interface chatHeaderProps {
  toggleSideNav: () => void;
}

const ChatHeader = ({ toggleSideNav }: chatHeaderProps) => {
  const pathName = usePathname();
  console.log(pathName);
  let chatName = "";

  if (pathName.includes("assistant")) {
    chatName = "비서 Pai";
  } else {
    chatName = "친구 Fai";
  }
  return (
    <div className="flex justify-between items-center">
      <button onClick={toggleSideNav}>
        <IoMenu />
      </button>
      <span>{chatName}</span>
      <Link href={"http://localhost:3000/chat"}>
        <button>X</button>
      </Link>
    </div>
  );
};

export default ChatHeader;
