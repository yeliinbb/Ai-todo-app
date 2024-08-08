"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const AccountHeader = () => {
  let accountPathname = usePathname();
  const pathname = accountPathname.slice(17);
  let text;

  switch (pathname) {
    case "nickname":
      text = "닉네임 변경";
      break;
    case "password":
      text = "비밀번호 변경";
      break;
    case "delete-account":
      text = "회원 탈퇴";
      break;
  }

  return (
    <div className="w-full flex justify-center mt-[15px]">
      <div className="md:w-8/12 min-w-[340px] flex justify-center">
        <div className="min-w-[340px] md:w-8/12 flex justify-center items-center relative">
          <Link href={"/my-page"}>
            <IoIosArrowBack className="w-[24px] h-[24px]  md:ml-4 absolute left-0 -translate-y-3 md:-translate-x-32 md:-left-1" />
          </Link>
          <h1 className="text-center text-xl w-[340px]">{text}</h1>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
