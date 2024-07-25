import { createClient } from "@/utils/supabase/client";
import React from "react";
import { SITE_URL } from "./FindPassword";

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
    } catch (error) {}
  };
  return (
    <button
      onClick={handleKakaoBtn}
      className="w-[36px] h-[36px] rounded-full bg-slate-400 hover:bg-slate-500 transition duration-200"
    >
      K
    </button>
  );
};

export default KakaoLoginBtn;
