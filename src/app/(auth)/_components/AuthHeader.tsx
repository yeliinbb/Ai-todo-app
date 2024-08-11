"use client";

import BackBtn from "@/components/icons/authIcons/BackBtn";
import usePageCheck from "@/hooks/usePageCheck";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const AuthHeader = () => {
  const router = useRouter();
  const { isLoginPage } = usePageCheck();
  // return (
  //   <div className="w-full flex justify-center mt-[15px]">
  //     <div className="md:w-8/12 min-w-[343px] flex justify-start " onClick={() => router.back()}>
  //       <BackBtn />
  //     </div>
  //   </div>
  // );

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
      <div className="md:w-8/12 min-w-[340px] flex justify-center">
        <div className="min-w-[340px] md:w-8/12 flex justify-center items-center relative">
          {/* 로그인 페이지에 뒤로가기 버튼 있는 것 수정 필요 */}
          {isLoginPage ? (
            <div></div>
          ) : (
            <div onClick={() => router.back()} className="pl-4">
              <BackBtn />
            </div>
          )}
          <h1 className="text-center text-xl text-gray-700 font-bold w-[340px] pr-[50px]">{text}</h1>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
