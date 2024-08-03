import NavBarWrapper from "@/components/NavBarWrapper";
import { Metadata } from "next";
import MyInfo from "./_components/MyInfo";

export const metadata: Metadata = {
  title: "My Page",
  description: "사용자의 투두 진척도를 확인하고 계정 관련 설정을 변경하는 페이지입니다."
};

const MyPage = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto md:px-12 sm:px-6">
      <MyInfo />
      <NavBarWrapper />
    </div>
  );
};

export default MyPage;
