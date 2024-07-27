"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteButtonProps {
  targetDiary: {
    diary_id: string;
    created_at: string;
    content: {
      title: string;
      content: string;
      diary_id: string;
    };
  };
}

const DiaryDeleteButton: React.FC<DeleteButtonProps> = ({ targetDiary }) => {
  

  return <button>삭제</button>;
};

export default DiaryDeleteButton;
