"use client";
import { AIType } from "@/types/chat.session.type";
import SessionBtn from "./_components/SessionBtn";
import { Metadata } from "next";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";

const metadata: Metadata = {
  title: "PAi 채팅 페이지",
  description: "PAi/FAi 채팅 페이지입니다.",
  keywords: ["chat", "assistant", "friend"],
  openGraph: {
    title: "채팅 페이지",
    description: "PAi/FAi 채팅 페이지입니다.",
    type: "website"
  }
};

const aiTypes: AIType[] = ["assistant", "friend"];

const ChatPage = () => {
  // TODO : 여기서 리스트 불러오면 prefetch 사용해서 렌더링 줄이기
  const { openModal, Modal } = useModal();
  const router = useRouter();

  const handleUnauthorized = () => {
    openModal(
      {
        message: "로그인 이후 사용가능한 서비스입니다.\n로그인페이지로 이동하시겠습니까?",
        confirmButton: { text: "확인", style: "시스템" }
      },
      () => router.push("/login")
    );
  };

  return (
    <>
      <Modal />
      <div className="pt-[4.5rem] bg-gray-100 h-full">
        <div className="gradient-container w-full h-full  border-solid border-2 border-grayTrans-30080 border-b-0 rounded-t-[60px]">
          <div className="gradient-rotated gradient-ellipse w-full h-[90%]"></div>
          <div className="relative z-10 w-full h-full">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <span className="text-gray-600 font-medium text-lg">어떤 파이와 이야기해 볼까요?</span>
              <div className="flex flex-col p-4 gap-6">
                {aiTypes.map((aiType) => (
                  <SessionBtn key={aiType} aiType={aiType} handleUnauthorized={handleUnauthorized} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
