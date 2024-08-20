"use client";

import { useState, useCallback } from "react";
import useModal from "./useModal";
import { useRouter } from "next/navigation";
import useChatSession from "./useChatSession";
import { AIType } from "@/types/chat.session.type";
import { useUserData } from "./useUserData";

export default function useCreateChatSession() {
  const [aiType, setAIType] = useState<AIType>("assistant");
  const [isAnyButtonIsPending, setIsAnyButtonIsPending] = useState(false);
  const [activeAiType, setActiveAiType] = useState<AIType | null>(null);
  const { openModal, Modal } = useModal();
  const { createSession, isCreateSessionPending } = useChatSession(aiType);
  const router = useRouter();
  const { data: { user_id: userId } = {} } = useUserData();

  const handleUnauthorized = useCallback(async () => {
    openModal(
      {
        message: "로그인 이후 사용가능한 서비스입니다.\n로그인페이지로 이동하시겠습니까?",
        confirmButton: { text: "확인", style: "시스템" }
      },
      () => router.push("/login")
    );
  }, [openModal, router]);

  const handleCreateSession = useCallback(
    async (selectedAiType: AIType) => {
      setAIType(selectedAiType);
      console.log("handleCreateSession called with:", selectedAiType); // 디버깅 로그

      if (isCreateSessionPending) {
        console.log("Already loading, returning"); // 디버깅 로그
        return;
      }

      setIsAnyButtonIsPending(true);
      setActiveAiType(selectedAiType);

      try {
        console.log("Calling createSession"); // 디버깅 로그
        const result = await createSession(selectedAiType);
        console.log("createSession result:", result); // 디버깅 로그

        if (result?.success) {
          router.push(`/chat/${selectedAiType}/${result.session.session_id}`);
        } else if (result?.error === "unauthorized") {
          handleUnauthorized();
          return;
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

  return {
    handleCreateSession,
    Modal,
    isAnyButtonIsPending,
    activeAiType
  };
}
