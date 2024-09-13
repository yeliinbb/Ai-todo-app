import { Metadata } from "next";
import ChatMain from "./_components/ChatMain";
import { Suspense } from "react";
import LoadingPageSpinner from "@/components/LoadingPageSpinner";

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
  // TODO : 여기서 리스트 불러오면 prefetch 사용해서 렌더링 줄이기

  return (
    <Suspense fallback={<LoadingPageSpinner />}>
      <ChatMain />
    </Suspense>
  );
};

export default ChatPage;
