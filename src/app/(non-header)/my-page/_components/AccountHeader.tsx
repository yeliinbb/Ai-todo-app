"use client";

import CommonBtn from "@/components/CommonBtn";
import BackBtnSmall from "@/components/icons/authIcons/BackBtnSmall";
import { usePathname, useRouter } from "next/navigation";

const AccountHeader = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  let accountPathname = usePathname();
  let text;

  switch (accountPathname) {
    case "/my-page":
      text = "마이 페이지";
      break;
    case "/my-page/account/nickname":
      text = "닉네임 변경";
      break;
    case "/my-page/account/password":
      text = "비밀번호 변경";
      break;
    case "/my-page/account/delete-account":
      text = "회원 탈퇴";
      break;
  }

  return (
    <div className="w-full h-[72px] flex justify-center mt-[15px]">
      <div className="desktop:w-full min-w-[340px] flex justify-center ">
        <div className="min-w-[375px] flex justify-between items-center px-4 w-full">
          <div className="hover:cursor-pointer" onClick={handleBack}>
            <CommonBtn icon={<BackBtnSmall />} />
          </div>
          <h1 className="desktop:font-extrabold desktop:text-[26px] text-center text-xl font-bold">{text}</h1>
          <div className="w-14 h-14">{/* 버튼만큼 공간 차지용 div */}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
