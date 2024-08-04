import NavBarWrapper from "@/components/NavBarWrapper";
import { Metadata } from "next";
import MyInfo from "./_components/MyInfo";

const MyPage = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto md:px-12 sm:px-6">
      <MyInfo />
      <NavBarWrapper />
    </div>
  );
};

export default MyPage;
