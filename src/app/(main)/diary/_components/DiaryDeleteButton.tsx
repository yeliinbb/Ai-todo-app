"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { DiaryContentType } from "@/types/diary.type";
import revalidateAction from "@/actions/revalidataPath";
import { useUserData } from "@/hooks/useUserData";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

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
  const handleDelete = async () => {
    const supabase = createClient();

    try {
      const { data, error: fetchError } = await supabase
        .from(DIARY_TABLE)
        .select("content")
        .eq("diary_id", diaryId)
        .single();

      if (fetchError) {
        console.error("Error fetching diary:", fetchError);
        return;
      }

      if (data?.content && Array.isArray(data.content)) {
        // content 배열에서 목표 항목을 제거
        const contentArray = data.content as DiaryContentType[];
        const updatedContent = contentArray.filter((entry) => entry.diary_id !== diaryContentId);

        // content 배열이 비어있는 경우 전체 다이어리를 삭제
        if (updatedContent.length === 0) {
          const { error: deleteError } = await supabase.from(DIARY_TABLE).delete().eq("diary_id", diaryId);
          if (deleteError) {
            console.error("Error deleting diary:", deleteError);
            return;
          }
        } else {
          // 업데이트된 content 배열을 Supabase에 저장
          const { error: updateError } = await supabase
            .from(DIARY_TABLE)
            .update({ content: updatedContent })
            .eq("diary_id", diaryId);
          if (updateError) {
            console.error("Error updating diary:", updateError);
            return;
          }
        }
        queryClient.invalidateQueries({ queryKey: [DIARY_TABLE, userId, selectedDate] });
        revalidateAction("/", "layout");
        alert("일기가 삭제되었습니다.");
        router.push("/diary"); // 다이어리 목록 페이지로 리다이렉트
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return <button onClick={handleDelete} className="w-[20%] bg-gray-400 text-center text-system-white py-3 rounded-md houver:bg-fai-300 transition-all">삭제</button>;
};

export default DiaryDeleteButton;
