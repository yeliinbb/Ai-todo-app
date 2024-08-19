"use client";
import { AIType } from "@/types/chat.session.type";
import SessionBtn from "./_components/SessionBtn";
import { Metadata } from "next";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import useChatSession from "@/hooks/useChatSession";
import { useState, useCallback } from "react";

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
  const [isAnyButtonIsPending, setIsAnyButtonIsPending] = useState(false);
  const [activeAiType, setActiveAiType] = useState<AIType | null>(null);
  const { createSession, isCreateSessionPending } = useChatSession(activeAiType || "assistant");
  const router = useRouter();

  const handleUnauthorized = useCallback(() => {
    openModal(
      {
        message: "로그인 이후 사용가능한 서비스입니다.\n로그인페이지로 이동하시겠습니까?",
        confirmButton: { text: "확인", style: "시스템" }
      },
      () => router.push("/login")
    );
  }, [openModal, router]);

  const handleCreateSession = useCallback(
    async (aiType: AIType) => {
      console.log("handleCreateSession called with:", aiType); // 디버깅 로그
      if (isCreateSessionPending) {
        console.log("Already loading, returning"); // 디버깅 로그
        return;
      }
      setIsAnyButtonIsPending(true);
      setActiveAiType(aiType);
      try {
        console.log("Calling createSession"); // 디버깅 로그
        const result = await createSession(aiType);
        console.log("createSession result:", result); // 디버깅 로그
        if (result?.success) {
          router.push(`/chat/${aiType}/${result.session.session_id}`);
        } else if (result?.error === "unauthorized") {
          handleUnauthorized();
        }
      } catch (error) {
        console.error("Error creating session:", error);
        // TODO: 에러 사용자 알림 추가
      } finally {
        setIsAnyButtonIsPending(false);
        setActiveAiType(null);
      }
    },
    [createSession, router, handleUnauthorized, isCreateSessionPending]
  );

  return (
    <>
      <Modal />
      <div className="pt-[4.5rem] bg-gray-100 h-[100dvh]">
        <div className="gradient-container w-full h-full border-solid border-2 border-grayTrans-30080 border-b-0 rounded-t-[60px]">
          <div className="gradient-rotated gradient-ellipse w-full h-[90%]"></div>
          <div className="relative z-10 w-full h-full">
            <div className="flex flex-col items-center justify-center w-full h-full desktop:mb-[2.5rem]">
              <span className="text-gray-600 text-sh4 mb-8 desktop:my-[5rem] desktop:text-[2rem]">
                어떤 파이와 이야기해 볼까요?
              </span>
              {/* 모바일 레이아웃 */}
              <div className="flex flex-col px-4 gap-8 w-full mb-8 desktop:hidden">
                {aiTypes.map((aiType) => (
                  <SessionBtn
                    key={aiType}
                    aiType={aiType}
                    handleCreateSession={handleCreateSession}
                    isPending={isAnyButtonIsPending}
                    isActive={activeAiType === aiType}
                  />
                ))}
              </div>

              {/* 데스크톱 레이아웃 */}
              <div className="hidden desktop:flex px-[3.25rem] gap-10 w-full justify-center">
                {aiTypes.map((aiType) => (
                  <SessionBtn
                    key={aiType}
                    aiType={aiType}
                    handleCreateSession={handleCreateSession}
                    isPending={isAnyButtonIsPending}
                    isActive={activeAiType === aiType}
                  />
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
