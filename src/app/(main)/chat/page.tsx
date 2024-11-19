import { Metadata } from "next";
import ChatMain from "./_components/ChatMain";
import { Suspense } from "react";
import Loading from "@/app/loading/loading";

// page.tsx 분리...
export const metadata: Metadata = {
  title: "PAi 채팅 페이지",
  description: "PAi/FAi 채팅 페이지입니다.",
  keywords: ["chat", "assistant", "friend"],
  openGraph: {
    title: "채팅 페이지",
    description: "PAi/FAi 채팅 페이지입니다.",
    type: "website"
  }
};

const ChatPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ChatMain />
    </Suspense>
  );
};

export default ChatPage;
