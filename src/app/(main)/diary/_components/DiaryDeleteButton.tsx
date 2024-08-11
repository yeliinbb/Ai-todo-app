"use client";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { useUserData } from "@/hooks/useUserData";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { toast } from "react-toastify";
import useModal from "@/hooks/useModal";

interface DeleteButtonProps {
  targetDiary: {
    diary_id: string;
    created_at: string;
    content: {
      title: string;
      content: string;
      diary_id: string;
      isFetching_todo: boolean;
    };
  };
}

const DiaryDeleteButton: React.FC<DeleteButtonProps> = ({ targetDiary }) => {
  const router = useRouter();
  const diaryId = targetDiary.diary_id;
  const diaryContentId = targetDiary.content.diary_id;
  const createdAt = targetDiary.created_at;
  const { data: loggedInUser } = useUserData();
  const { selectedDate } = useselectedCalendarStore();
  const userId = loggedInUser?.email;
  const queryClient = useQueryClient();
  const { openModal, Modal } = useModal();

  const handleDelete = useCallback(async () => {
    try {
      const response = await fetch("/api/diaries/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ diaryId, diaryContentId })
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(`삭제 완료`);
        queryClient.invalidateQueries({ queryKey: [DIARY_TABLE, userId, selectedDate] });
        router.push("/diary");
      } else {
        console.error(result.error);
        toast.error(`삭제 실패`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`삭제 로직의 오류`);
      } else {
        toast.error(`삭제 하는 과정 중 예상치 못한 오류 발생`);
      }
    }
  }, [diaryId, diaryContentId, queryClient, router, userId, selectedDate]);
  // const handleDelete = async () => {
  //   const supabase = createClient();

  //   try {
  //     const { data, error: fetchError } = await supabase
  //       .from(DIARY_TABLE)
  //       .select("content")
  //       .eq("diary_id", diaryId)
  //       .single();

  //     if (fetchError) {
  //       console.error("Error fetching diary:", fetchError);
  //       return;
  //     }

  //     if (data?.content && Array.isArray(data.content)) {
  //       // content 배열에서 목표 항목을 제거
  //       const contentArray = data.content as DiaryContentType[];
  //       const updatedContent = contentArray.filter((entry) => entry.diary_id !== diaryContentId);

  //       // content 배열이 비어있는 경우 전체 다이어리를 삭제
  //       if (updatedContent.length === 0) {
  //         const { error: deleteError } = await supabase.from(DIARY_TABLE).delete().eq("diary_id", diaryId);
  //         if (deleteError) {
  //           console.error("Error deleting diary:", deleteError);
  //           return;
  //         }
  //       } else {
  //         // 업데이트된 content 배열을 Supabase에 저장
  //         const { error: updateError } = await supabase
  //           .from(DIARY_TABLE)
  //           .update({ content: updatedContent })
  //           .eq("diary_id", diaryId);
  //         if (updateError) {
  //           console.error("Error updating diary:", updateError);
  //           return;
  //         }
  //       }
  //       queryClient.invalidateQueries({ queryKey: [DIARY_TABLE, userId, selectedDate] });
  //       revalidateAction("/", "layout");
  //       alert("일기가 삭제되었습니다.");
  //       router.push("/diary"); // 다이어리 목록 페이지로 리다이렉트
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //   }
  // };

  const handleDeleteClick = () => {
    openModal(
      {
        message: "삭제하시면 복구가 어렵습니다. \n정말 삭제하시겠습니까?",
        confirmButton: { text: "삭제", style: "삭제" }
      },
      handleDelete
    );
  };

  return (
    <>
      <Modal />
      <button
        onClick={handleDeleteClick}
        className="w-[163px] h-10 bg-system-red200 text-center py-1.5 px-6 rounded-full houver:bg-fai-300 transition-all"
      >
        <p className="h-7 text-sm font-extrabold leading-7 tracking-custom-letter-spacing text-system-white">삭제</p>
      </button>
    </>
  );
};

export default DiaryDeleteButton;
