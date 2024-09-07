import Naver from "@/components/icons/authIcons/Naver";
import React from "react";

const NaverLoginBtn = () => {
  return (
    // 네이버 컬러 색상 지정해주고 변경
    // bg-naver-default : #03C75A
    // border-naver-line : #007f39
    // bg-naver-active : #009c46
    <div className="min-w-[44px] min-h-[44px] duration-200 flex justify-center box-border items-center rounded-full bg-naver-default hover:cursor-pointer hover:border hover:border-naver-line active:bg-naver-active active:border-none">
      <Naver />
    </div>
  );
};

export default NaverLoginBtn;
