import Google from "@/components/icons/authIcons/Google";
import { createClient } from "@/utils/supabase/client";

//const SITE_URL = "http://localhost:3000";
export const VERCEL_URL = "https://ai-todo-app-beta.vercel.app/";

const GoogleLoginBtn = () => {
  const handleGoogleButtonClick = async () => {
    const supabase = createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${VERCEL_URL}/api/auth/login/callback`
      }
    });
    if (signInError) {
      console.log("구글 로그인 에러", signInError);
    }
  };

  return (
    <div
      onClick={handleGoogleButtonClick}
      className="min-w-[44px] min-h-[44px] duration-200 flex justify-center box-border items-center rounded-full bg-google-default hover:cursor-pointer hover:border hover:border-google-line active:bg-google-active active:border-none"
    >
      <Google />
    </div>
  );
};

export default GoogleLoginBtn;
