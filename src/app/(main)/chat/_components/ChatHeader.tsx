import Link from "next/link";
import ChatNav from "./ChatNav";

const ChatHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <ChatNav />
      <span>비서 PAi</span>
      <Link href={"http://localhost:3000/chat"}>
        <button>X</button>
      </Link>
    </div>
  );
};

export default ChatHeader;
