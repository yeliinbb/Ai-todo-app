"use client";
import { PropsWithChildren } from "react";

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)]">
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};

export default ChatLayout;
