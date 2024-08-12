"use client";

import CommonBtn from "@/components/CommonBtn";
import BackBtn from "@/components/icons/authIcons/BackBtn";
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
      <div className="md:w-8/12 min-w-[340px] flex justify-center ">
        <div className="min-w-[375px] md:w-8/12 flex justify-between items-center px-4 w-full">
          <CommonBtn icon={<BackBtn />} onClick={handleBack} />
          <h1 className="text-center text-xl">{text}</h1>
          <div className="w-14 h-14">{/* 버튼만큼 공간 차지용 div */}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
