import Naver from "@/components/icons/authIcons/Naver";
import { signIn, useSession } from "next-auth/react";

const NaverLoginBtn = () => {
  const handleNaverBtn = async () => {
    const result = await signIn("naver", { redirect: true, callbackUrl: "/home" });
    // supabase public-users 로우 추가 코드 작성(insert policy 해제)
  };

  return (
    <div
      onClick={handleNaverBtn}
      className="min-w-[44px] min-h-[44px] duration-200 flex justify-center box-border items-center rounded-full bg-naver-default hover:cursor-pointer hover:border hover:border-naver-line active:bg-naver-active active:border-none"
    >
      <Naver />
    </div>
  );
};

export default NaverLoginBtn;
