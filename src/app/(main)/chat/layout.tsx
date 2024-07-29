import { PropsWithChildren } from "react";
import ChatHeader from "./_components/ChatHeader";

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <ChatHeader />
      {children}
    </div>
  );
};

export default ChatLayout;
