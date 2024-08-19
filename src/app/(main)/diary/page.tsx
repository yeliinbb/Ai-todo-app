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
    <div className="bg-gray-100">
      <DiaryListPage />
      {/* NavBar만큼 아래 공간 띄우기용 div */}
      {/* <div className="h-20 bg-faiTrans-20060 w-full"></div> */}
    </div>
  );
};

export default DiaryHome;
