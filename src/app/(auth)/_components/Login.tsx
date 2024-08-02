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
import PAiLogo from "./PAiLogo";

const Login = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [hidePw, setHidePw] = useState<boolean>(false);
  const { email, password, error, setEmail, setPassword, setError } = useAuthStore();

  useEffect(() => {
    setError({ nickname: "", email: "", password: "", passwordConfirm: "" });
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
      setError({ ...error, email: "" });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, password: "" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    throttle(async () => {
      const newError = { ...error };

      if (!email || !password) {
        if (!email) newError.email = "빈칸을 입력해주세요.";
        if (!password) newError.password = "빈칸을 입력해주세요.";
        setError(newError);
        return;
      }

      if (!emailReg.test(email)) {
        newError.email = "잘못된 형식의 이메일 주소입니다.";
        setError(newError);
        return;
      }

      if (!passwordReg.test(password)) {
        newError.password = "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)";
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

        if (response.ok) {
          toast.success(`${user_metadata?.nickname}님, 메인 페이지로 이동합니다.`, {
            onClose: () => {
              router.push("/todo-list");
            }
          });
        }
      } catch (error) {
        toast.warn("입력된 비밀번호가 올바르지 않습니다.");
        setIsDisabled(true);
      }
    }, 2000);
  };

  // const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const newError = { ...error };

  //   if (!email || !password) {
  //     if (!email) newError.email = "빈칸을 입력해주세요.";
  //     if (!password) newError.password = "빈칸을 입력해주세요.";
  //     setError(newError);
  //     return;
  //   }

  //   // 이메일 형식
  //   if (!emailReg.test(email)) {
  //     newError.email = "잘못된 형식의 이메일 주소입니다. 이메일 주소를 정확히 입력해주세요.";
  //     setError(newError);
  //   }

  //   // 비밀번호 유효성 검사
  //   if (!passwordReg.test(password)) {
  //     newError.password = "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)";
  //   }

  //   try {
  //     const response = await fetch(`/api/auth/login`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email,
  //         password
  //       })
  //     });

  //     const {
  //       user: { user_metadata }
  //     } = await response.json();

  //     // TODO: 토스트 컨테이너 스타일 수정하기
  //     if (response.ok) {
  //       toast.success(`${user_metadata?.nickname}님, 메인 페이지로 이동합니다.`, {
  //         onClose: () => {
  //           router.push("/todo-list");
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     toast.warn("입력된 비밀번호가 올바르지 않습니다.");
  //   }
  // };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PAiLogo />
      <form className="md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleFormSubmit}>
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
        <SubmitBtn text={"로그인"} type={"submit"} isDisabled={isDisabled} />
      </form>
      <div className="flex mt-4 mb-9 gap-5 text-sm font-medium text-gray-600">
        <Link href="/sign-up">
          <p className="hover:cursor-pointer">이메일로 가입하기</p>
        </Link>
        <p>|</p>
        <Link href="/login/find-password">
          <p className="hover:cursor-pointer">비밀번호 찾기</p>
        </Link>
      </div>
      <div className="md:w-8/12 mt-12 relative flex flex-col justify-center items-center border-t border-gray-200">
        <p className="text-center min-w-[100px] absolute bg-system-white top-7 -translate-y-9 text-xs text-gray-400 font-extrabold">
          간편 로그인
        </p>
        <div className="md:w-8/12 md:gap-24 min-w-[340px] flex justify-center gap-14 mt-10">
          <KakaoLoginBtn />
          <button className="w-[36px] h-[36px] rounded-full bg-slate-400  hover:bg-slate-500 transition duration-200">
            A
          </button>
          <GoogleLoginBtn />
        </div>
      </div>
    </div>
  );
};

export default Login;
