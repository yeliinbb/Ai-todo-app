import Kakao from "@/components/icons/authIcons/Kakao";
import { createClient } from "@/utils/supabase/client";

export const SITE_URL = "http://localhost:3000";

const KakaoLoginBtn = () => {
  const handleKakaoBtn = async () => {
    const supabase = createClient();
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${SITE_URL}/api/auth/login/callback`
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
    <div onClick={handleKakaoBtn}>
      <Kakao />
      {/* <button
        onClick={handleKakaoBtn}
        className="w-[36px] h-[36px] rounded-full bg-slate-400 hover:bg-slate-500 transition duration-200"
      >
        K
      </button> */}
    </div>
  );
};

export default KakaoLoginBtn;
