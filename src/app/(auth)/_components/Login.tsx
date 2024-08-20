"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import GoogleLoginBtn from "./GoogleLoginBtn";
import KakaoLoginBtn from "./KakaoLoginBtn";
import { emailReg, passwordReg } from "@/lib/utils/auth/authValidation";
import { useThrottle } from "@/hooks/useThrottle";
import InputBox from "./InputBox";
import SubmitBtn from "./SubmitBtn";
import Logo from "@/components/Logo";
import Line from "@/components/icons/authIcons/Line";

const Login = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hidePw, setHidePw] = useState<boolean>(false);
  const { email, password, error, setEmail, setPassword, setError } = useAuthStore();

  useEffect(() => {
    setError({ nickname: "", email: "", password: "", passwordConfirm: "", loginFailed: "" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isEmailValid = emailReg.test(email);
    const isPasswordValid = passwordReg.test(password);
    setIsDisabled(!(isEmailValid && isPasswordValid));
    // eslint-disable-next-line
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, email: "", password: "", loginFailed: "" });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, email: "", password: "", loginFailed: "" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    router.prefetch("/home");
    throttle(async () => {
      const newError = { ...error };

      if (!email || !password) {
        if (!email) newError.email = "빈칸을 입력해주세요.";
        if (!password) newError.password = "빈칸을 입력해주세요.";
        setError(newError);
        setIsLoading(false);
        return;
      }

      if (!emailReg.test(email)) {
        newError.email = "잘못된 형식의 이메일 주소입니다.";
        setError(newError);
        setIsLoading(false);
        return;
      }

      if (!passwordReg.test(password)) {
        newError.password = "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)";
        setError(newError);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email,
            password
          })
        });

        const {
          user: { user_metadata }
        } = await response.json();

        if (user_metadata) {
          setIsLoading(false);
          toast.success(`${user_metadata?.nickname}님, 반갑습니다!`);
          router.push("/home");
        }
      } catch (errorMessage) {
        //toast.warn("로그인을 다시 시도해주세요.");
        setError({
          ...error,
          email: " ",
          password: " ",
          loginFailed: "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요."
        });
        setIsDisabled(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="desktop:hidden mt-11 mb-[54px]">
        <Logo type="main" />
      </div>
      <div className="desktop:block desktop:mb-6 desktop:px-[52px] desktop:py-[60px] desktop:mt-4  hidden">
        <h1 className="text-center leading-7 tracking-[0.8px] text-[32px] font-extrabold text-transparent bg-clip-text bg-gradient-pai400-fai500-br">
          로그인
        </h1>
      </div>
      <form className="relative md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleFormSubmit}>
        <InputBox
          text={"이메일"}
          id={"email"}
          type={"text"}
          value={email}
          onChange={handleEmailChange}
          placeholder={"welcome@example.com"}
          error={error}
        />
        <InputBox
          text={"비밀번호"}
          id={"password"}
          type={!hidePw ? "password" : "text"}
          value={password}
          onChange={handlePasswordChange}
          placeholder={"영문, 숫자, 특수문자 포함 6~12자"}
          error={error}
          hidePw={hidePw}
          setHidePw={setHidePw}
        />
        <p className="desktop:ml-24 desktop:text-sm absolute bottom-14 translate-y-1 pl-8 py-1 font-extrabold text-xs text-system-error text-center">
          {error.loginFailed}
        </p>
        <SubmitBtn text={"로그인"} type={"submit"} isDisabled={isDisabled} isLoading={isLoading} />
      </form>
      <div className="desktop:text-lg flex justify-center items-center mt-4 mb-4 gap-1 text-sm font-medium text-gray-600">
        <Link href="/sign-up">
          <p className="desktop:w-[140px] hover:cursor-pointer w-[130px] text-center rounded-[24px] px-5 py-[6px] duration-200 hover:bg-gray-200 text-gray-600 active:text-gray-800">
            회원가입
          </p>
        </Link>
        <div className="flex justify-center items-center w-[20px]">
          <Line />
        </div>
        <Link href="/login/find-password">
          <p className="desktop:w-[140px] hover:cursor-pointer w-[130px] text-center rounded-[24px] px-5 py-[6px] duration-200 hover:bg-gray-200 text-gray-600 active:text-gray-800">
            비밀번호 찾기
          </p>
        </Link>
      </div>
      <div className="desktop:w-[580px] desktop:mt-20 md:w-8/12 mt-12 relative flex flex-col justify-center items-center border-t border-gray-200">
        <p className="desktop:text-base desktop:top-6 desktop:font-bold desktop:w-[110px] text-center min-w-[100px] absolute bg-gray-100 top-7 -translate-y-9 text-xs text-gray-400 font-extrabold">
          간편 로그인
        </p>
        <div className="md:w-8/12 md:gap-24 min-w-[340px] flex justify-center gap-14 mt-10 mb-8">
          <KakaoLoginBtn />
          <GoogleLoginBtn />
        </div>
      </div>
    </div>
  );
};

export default Login;

{
  /* <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="mt-11 mb-[54px]">
        <Logo />
      </div>
      <form className="relative md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleFormSubmit}>
        <InputBox
          text={"이메일"}
          id={"email"}
          type={"text"}
          value={email}
          onChange={handleEmailChange}
          placeholder={"welcome@example.com"}
          error={error}
        />
        <InputBox
          text={"비밀번호"}
          id={"password"}
          type={!hidePw ? "password" : "text"}
          value={password}
          onChange={handlePasswordChange}
          placeholder={"영문, 숫자, 특수문자 포함 6~12자"}
          error={error}
          hidePw={hidePw}
          setHidePw={setHidePw}
        />
        <p className="absolute bottom-14 translate-y-1 pl-8 py-1 font-extrabold text-[12px] text-system-error text-center">
          {error.loginFailed}
        </p>
        <SubmitBtn text={"로그인"} type={"submit"} isDisabled={isDisabled} isLoading={isLoading} />
      </form>
      <div className="flex justify-center items-center mt-4 mb-4 gap-1 text-sm font-medium text-gray-600">
        <Link href="/sign-up">
          <p className="hover:cursor-pointer w-[130px] text-center rounded-[24px] px-5 py-[6px] duration-200 hover:bg-gray-400 text-gray-600 active:text-gray-800">
            회원가입
          </p>
        </Link>
        <div className="flex justify-center items-center w-[20px]">
          <Line />
        </div>
        <Link href="/login/find-password">
          <p className="hover:cursor-pointer w-[130px] text-center rounded-[24px] px-5 py-[6px] duration-200 hover:bg-gray-400 text-gray-600 active:text-gray-800">
            비밀번호 찾기
          </p>
        </Link>
      </div>
      <div className="md:w-8/12 mt-12 relative flex flex-col justify-center items-center border-t border-gray-200">
        <p className="text-center min-w-[100px] absolute bg-system-white top-7 -translate-y-9 text-xs text-gray-400 font-extrabold">
          간편 로그인
        </p>
        <div className="md:w-8/12 md:gap-24 min-w-[340px] flex justify-center gap-14 mt-10 mb-8">
          <KakaoLoginBtn />
          <GoogleLoginBtn />
        </div>
      </div>
    </div> */
}
