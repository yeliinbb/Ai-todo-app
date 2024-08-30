"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { useUserData } from "@/hooks/useUserData";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { toast } from "react-toastify";
import useModal from "@/hooks/useModal";

interface DeleteButtonProps {
  targetDiary: string;
  targetDiaryContentId: string;
  buttonStyle?: string;
  textStyle?: string;
  setOpenDropDownIndex?: React.Dispatch<React.SetStateAction<string>>;
}

const DiaryDeleteButton: React.FC<DeleteButtonProps> = ({
  targetDiary,
  targetDiaryContentId,
  buttonStyle,
  textStyle,
  setOpenDropDownIndex
}) => {
  const router = useRouter();
  const { data: loggedInUser } = useUserData();
  const { selectedDate } = useselectedCalendarStore();
  const userId = loggedInUser?.user_id as string;
  const queryClient = useQueryClient();
  const { openModal, Modal } = useModal();
  const pathName = usePathname();
  const handleDelete = useCallback(async () => {
    try {
      const response = await fetch("/api/diaries/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ targetDiary, targetDiaryContentId })
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(`삭제 완료`);

        if (pathName !== "/diary") {
          router.push("/diary");
        }
        if (setOpenDropDownIndex) {
          setOpenDropDownIndex("-1");
        }
      } else {
        console.error(result.error);
        if (setOpenDropDownIndex) {
          setOpenDropDownIndex("-1");
        }
        toast.error(`삭제 실패`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (setOpenDropDownIndex) {
          setOpenDropDownIndex("-1");
        }
        toast.error(`삭제 로직의 오류`);
      } else {
        if (setOpenDropDownIndex) {
          setOpenDropDownIndex("-1");
        }
        toast.error(`삭제 하는 과정 중 예상치 못한 오류 발생`);
      }
    } finally {
      await queryClient.invalidateQueries({ queryKey: [DIARY_TABLE, userId, selectedDate] });
      await queryClient.invalidateQueries({ queryKey: [DIARY_TABLE] });
      if (setOpenDropDownIndex) {
        setOpenDropDownIndex("-1");
      }
    }
  }, [targetDiary, targetDiaryContentId, queryClient, router, userId, selectedDate, setOpenDropDownIndex, pathName]);

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
      <button onClick={handleDeleteClick} className={buttonStyle}>
        <p className={textStyle}>삭제</p>
      </button>
    </>
  );
};

export default DiaryDeleteButton;
