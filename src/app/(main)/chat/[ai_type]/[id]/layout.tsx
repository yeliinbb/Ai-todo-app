"use client";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import SideNavBar from "@/components/SideNavBar";
import { PropsWithChildren } from "react";

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderWithSearch />
      <SideNavBar />
      <div className="flex-grow overflow-y-scroll">{children}</div>
    </div>
  );
};

export default ChatLayout;
