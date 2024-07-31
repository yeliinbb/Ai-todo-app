"use client";
import { PropsWithChildren, useState } from "react";
import ChatHeader from "../_components/ChatHeader";
import ChatSideNav from "../_components/ChatSideNav";

// 추후에 chat 컴포넌트 통일하면 ChatLayout으로 변경
const AssistantChatLayout = ({ children }: PropsWithChildren) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleClose = () => setIsSideNavOpen(false);

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader toggleSideNav={toggleSideNav} />
      <ChatSideNav isSideNavOpen={isSideNavOpen} handleClose={handleClose} />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default AssistantChatLayout;
