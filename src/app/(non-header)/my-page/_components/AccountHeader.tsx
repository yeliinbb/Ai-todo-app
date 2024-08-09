"use client";

import CommonBtn from "@/components/CommonBtn";
import BackBtn from "@/components/icons/authIcons/BackBtn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AccountHeader = () => {
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
      <div className="md:w-8/12 min-w-[340px] flex justify-center">
        <div className="min-w-[375px] md:w-8/12 flex justify-center items-center relative">
          <Link href={"/my-page"} className="absolute left-0">
            <CommonBtn icon={<BackBtn />} />
          </Link>
          <h1 className="text-center text-xl w-[340px]">{text}</h1>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
