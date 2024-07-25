"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import GoogleLoginBtn from "./GoogleLoginBtn";
import KakaoLoginBtn from "./KakaoLoginBtn";
import { createClient } from "@/utils/supabase/client";
import { emailReg, passwordReg } from "@/utils/authValidation";

export const SITE_URL = "http://localhost:3000";

const Login = () => {
  const router = useRouter();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const { email, password, error, setEmail, setPassword, setError } = useAuthStore();

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

  console.log(email, password);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newError = { ...error };

    if (!email || !password) {
      if (!email) newError.email = "빈칸을 입력해주세요.";
      if (!password) newError.password = "빈칸을 입력해주세요.";
      setError(newError);
      return;
    }

    // 1. 존재여부
    // if (!emailExists) {
    //   newError.email = "가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.";
    // }

    // 2. 이메일 형식
    if (!emailReg.test(email)) {
      newError.email = "잘못된 형식의 이메일 주소입니다. 이메일 주소를 정확히 입력해주세요.";
      setError(newError);
    }

    // 비밀번호 유효성 검사
    if (!passwordReg.test(password)) {
      newError.password = "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)";
    }

    try {
      const response = await fetch(`${SITE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      });

      const {
        user: { user_metadata }
      } = await response.json();

      //  TODO: 토스트 컨테이너 스타일 수정하기
      toast(`${user_metadata?.nickname}님, 메인 페이지로 이동합니다.`, {
        onClose: () => {
          router.push("/");
        }
      });
    } catch (error) {
      console.log("로그인 중 에러 발생");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-11 mb-[90px] text-[30px] font-bold">PAi</h1>
      <form className="md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleFormSubmit}>
        <div className="relative flex flex-col">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="welcome@example.com"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 transform -translate-y-3 text-[12px] text-red-500">{error.email}</p>
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type={!hidePw ? "password" : "text"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="영문, 숫자, 특수문자 포함 6~12자"
            className="min-w-[340px] h-10 mt-1 mb-16 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 transform -translate-y-3 text-[12px] text-red-500">{error.password}</p>
          {!hidePw ? (
            <FaRegEyeSlash
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/3 transform -translate-y-1/3 hover:cursor-pointer"
              onClick={() => setHidePw(!hidePw)}
            />
          ) : (
            <FaRegEye
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/3 transform -translate-y-1/3 hover:cursor-pointer"
              onClick={() => setHidePw(!hidePw)}
            />
          )}
        </div>
        <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
        <button className="min-w-[340px] h-12 mt-7 mb-2.5 bg-slate-200 rounded-[10px] ">로그인</button>
      </form>
      <div className="flex mt-2.5 mb-9 gap-5 text-xs">
        <Link href="/sign-up">
          <p className="hover:cursor-pointer">이메일로 가입하기</p>
        </Link>
        <p>|</p>
        <Link href="/login/find-password">
          <p className="hover:cursor-pointer">비밀번호 찾기</p>
        </Link>
      </div>

      <div className="md:w-8/12 mt-14 relative flex flex-col justify-center items-center border-t border-gray-300">
        <p className="text-center min-w-[150px] absolute bg-white top-7 transform  -translate-y-10">간편 로그인</p>
        <div className="md:w-8/12 md:gap-24 min-w-[340px] flex justify-center gap-14 mt-14">
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
