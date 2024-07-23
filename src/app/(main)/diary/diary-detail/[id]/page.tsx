// src/app/diary/diary-detail/[id]/page.tsx
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { DiaryEntry } from "@/types/diary.type";
import { notFound } from "next/navigation";

// 서버 측에서 데이터 패칭하기
async function getDiaryDetail(id: string): Promise<DiaryEntry | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("diaries").select("*").eq("diary_id", id).single();

  if (error || !data) {
    return null;
  }

  return data as DiaryEntry;
}

interface DiaryDetailPageProps {
  params: {
    id: string;
  };
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = async ({ params }) => {
  const { id } = params;

  // 서버 측에서 데이터 가져오기
  const diary = await getDiaryDetail(id);

  if (!diary) {
    return <div>상세내용 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>Diary Details</h1>
      <p>Date: {diary.created_at}</p>
      {diary.content.map((item, index) => (
        <div key={index}>
          <h2>{item.title}</h2>
          <p>{item.content}</p>
          <p>
            Address: {item.address.lat}, {item.address.lng}
          </p>
        </div>
      ))}
      <div>
        <button>수정</button>
        <button>삭제</button>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
