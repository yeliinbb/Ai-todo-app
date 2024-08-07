import { Metadata } from "next";
import DiaryListPage from "./_components/DiaryList";

export const metadata: Metadata = {
  title: "PAi다이어리 목록",
  description: "사용자의 PAi 다이어리 목록을 보여주는 페이지입니다.",
  keywords: ["diary", "list", "calendar"],
  openGraph: {
    title: "다이어리 목록",
    description: "사용자의 다이어리 목록을 보여주는 페이지입니다.",
    type: "website"
  }
};

const DiaryHome = async () => {
  return (
    <>
      <DiaryListPage />

    </>
  );
};

export default DiaryHome;
