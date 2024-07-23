"use client";

import { DiaryEntry } from "@/types/diary.type";
import { fetchDiaryData } from "@/utils/fetchDiaryData";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

interface DiaryContentProps {
  date: string;
}
const DiaryContent: React.FC<DiaryContentProps> = ({ date }) => {
  const router = useRouter();
  const { data, error, isPending } = useQuery<DiaryEntry[], Error>({
    queryKey: ["diaries", date],
    queryFn: () => fetchDiaryData(date),
    enabled: !!date
  });
  const handleEditClick = (diaryId: string) => {
    router.push(`/diary/diary-detail/${diaryId}`);
  };
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="w-[]">
      <h3>{date}</h3>
      {data && data.length > 0 ? (
        data.map((entry) => (
          <>
            <div key={entry.diary_id}>
              <p>{entry.created_at}</p>
              {entry.content.map((item, index) => (
                <div key={index}>
                  <h4>{item.title}</h4>
                  <p>{item.content}</p>
                  <p>
                    Address: {item.address.lat}, {item.address.lng}
                  </p>
                </div>
              ))}
            </div>
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              onClick={() => handleEditClick(entry.diary_id)}
            >
              상세보기
            </button>
          </>
        ))
      ) : (
        <>
          <div>해당 날짜의 다이어리가 없습니다.</div>
          <button onClick={() => router.push("/diary/write-diary")}>일기 쓰기</button>
        </>
      )}
      <p>날짜를 선택하여 다이어리를 확인하세요</p>
      <button
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={() => router.push("/diary/write-diary")}
      >
        나 혼자 일기 쓰기
      </button>
    </div>
  );
};

export default DiaryContent;
