import { PropsWithChildren } from "react";
import ChatHeader from "../_components/ChatHeader";

// 추후에 chat 컴포넌트 통일하면 ChatLayout으로 변경
const AssistantChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <ChatHeader />
      {children}
    </div>
  );
};

export default AssistantChatLayout;
