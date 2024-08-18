"use client";

import BackBtn from "@/components/icons/authIcons/BackBtn";
import { usePathname, useRouter } from "next/navigation";
const AuthHeader = () => {
  const router = useRouter();
  let authPathname = usePathname();
  let text;

  switch (authPathname) {
    case "/sign-up":
      text = "회원가입";
      break;
    case "/login/find-password":
    case "/login/reset-password":
      text = "비밀번호 재설정";
      break;
    default:
      text = "";
  }

  return (
    <div className="w-full flex justify-center mt-[15px]">
      <div className="desktop:w-full min-w-[340px] flex justify-center">
        <div className="desktop:w-full min-w-[340px] flex items-center relative">
          <div onClick={() => router.back()} className="abolute pl-4 left-4">
            <BackBtn />
          </div>
          <h1
            className={`${text === "회원가입" && "desktop:invisible"} desktop:w-full text-center text-xl text-gray-700 font-bold w-[340px] pr-[50px]`}
          >
            {text}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
