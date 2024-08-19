import Kakao from "@/components/icons/authIcons/Kakao";
import { createClient } from "@/utils/supabase/client";
import { VERCEL_URL } from "./GoogleLoginBtn";

const KakaoLoginBtn = () => {
  const handleKakaoBtn = async () => {
    const supabase = createClient();
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${VERCEL_URL}/api/auth/login/callback`
        }
      });
      if (signInError) {
        console.log("카카오로그인 에러", signInError);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      onClick={handleKakaoBtn}
      className="min-w-[44px] min-h-[44px] duration-200 flex justify-center box-border items-center rounded-full bg-kakao-default hover:cursor-pointer hover:border hover:border-kakao-line active:bg-kakao-active active:border-none"
    >
      <Kakao />
    </div>
  );
};

export default KakaoLoginBtn;
