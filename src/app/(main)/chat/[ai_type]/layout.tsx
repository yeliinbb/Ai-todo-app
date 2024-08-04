"use client";
import { PropsWithChildren} from "react";
import HeaderWithSearch from "../../../../components/HeaderWithSearch";
import SideNavBar from "../../../../components/SideNavBar";

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
