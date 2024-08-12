"use client";
import { PropsWithChildren } from "react";
import HeaderWithSearch from "../../../../components/header/HeaderWithSearch";

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-[calc(100dvh-4.5rem)]">
      {/* <HeaderWithSearch /> */}
      {children}
    </div>
  );
};

export default ChatLayout;
