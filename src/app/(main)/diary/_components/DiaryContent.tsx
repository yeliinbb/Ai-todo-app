"use client";
import { createClient } from "@/utils/supabase/client";
import React from "react";

interface DiaryContentProps {
  date: string;
}

interface DiaryEntry {
  diary_id: string;
  created_at: string;
  content: string;
  user_id: string;
}
const user_id = "kimyong1@result.com";
const DiaryContent =  ({ date }: DiaryContentProps) => {
  const supabase = createClient();
  console.log(date);
  // // 현재 로그인된 사용자 정보 가져오기
  // const {
  //   data: { user }
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return <div>로그인이 필요합니다.</div>;
  // }

  // // 날짜의 시작과 끝 설정
  const startDate = new Date(date);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setUTCHours(23, 59, 59, 999);

  // const { data: diaryData, error } = await supabase
  //   .from("diary")
  //   .select("*")
  //   .eq("user_id", user_id)
  //   .gte("created_at", startDate.toISOString())
  //   .lt("created_at", endDate.toISOString())
  //   .order("created_at", { ascending: true });

  // if (error) {
  //   console.error("Error fetching diary data:", error);
  //   return <div>데이터를 불러오는 데 실패했습니다.</div>;
  // }

  // if (!diaryData || diaryData.length === 0) {
  //   return <div>해당 날짜의 다이어리가 없습니다.</div>;
  // }

  return <div>{date}</div>;
};

export default DiaryContent;
