import { createClient } from "@/utils/supabase/client";
import React from "react";

const SITE_URL = "http://localhost:3000";

const GoogleLoginBtn = () => {
  const handleGoogleButtonClick = async () => {
    const supabase = createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${SITE_URL}/api/auth/login/callback`
        // queryParams: {
        //   access_type: "offline",
        //   prompt: "consent"
        // }
      }
    });
    const { data, error: getUserData } = await supabase.auth.getSession();
    if (data) {
      console.log(data);
    }
  };

  return (
    <button
      onClick={handleGoogleButtonClick}
      className="w-[36px] h-[36px] rounded-full bg-slate-400  hover:bg-slate-500 transition duration-200"
    >
      G
    </button>
  );
};

export default GoogleLoginBtn;
