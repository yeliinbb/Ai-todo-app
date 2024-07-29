"use client";
import Link from "next/link";
import ChatNav from "./ChatNav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ChatHeader = () => {
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
      <ChatNav />
      <span>{chatName}</span>
      <Link href={"http://localhost:3000/chat"}>
        <button>X</button>
      </Link>
    </div>
  );
};

export default ChatHeader;
