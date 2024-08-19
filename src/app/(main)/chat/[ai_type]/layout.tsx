"use client";
import { PropsWithChildren } from "react";

const ChatLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col h-[100dvh] pt-[4.5rem] desktop:pt-[5.375rem] bg-gray-100">{children}</div>;
};

export default ChatLayout;
