import { createClient } from "@/utils/supabase/client";

const SITE_URL = "http://localhost:3000";

const GoogleLoginBtn = () => {
  const handleGoogleButtonClick = async () => {
    const supabase = createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${SITE_URL}/api/auth/login/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });
    if (signInError) {
      console.log("구글 로그인 에러", signInError);
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
