"use client";

import BackBtn from "@/components/icons/authIcons/BackBtn";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const AuthHeader = () => {
  // const router = useRouter();
  // return (
  //   <div className="w-full flex justify-center mt-[15px]">
  //     <div className="md:w-8/12 min-w-[343px] flex justify-start " onClick={() => router.back()}>
  //       <BackBtn />
  //     </div>
  //   </div>
  // );

  let authPathname = usePathname();
  const pathname = authPathname.slice(17);
  let text;
  console.log(authPathname);

  switch (authPathname) {
    case "/sign-up":
      text = "회원가입";
      break;
    case "/login/find-password":
      text = "비밀번호 재설정";
      break;
    case "/login/reset-password":
      text = "비밀번호 재설정";
      break;
  }

  return (
    <div className="w-full flex justify-center mt-[15px]">
      <div className="md:w-8/12 min-w-[340px] flex justify-center">
        <div className="min-w-[340px] md:w-8/12 flex justify-center items-center relative">
          <Link href={"/my-page"} className="pl-4">
            <BackBtn />
          </Link>
          <h1 className="text-center text-xl text-gray-700 font-bold w-[340px] pr-[50px]">{text}</h1>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
