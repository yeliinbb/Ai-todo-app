"use client";

import React, { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const {
    nickname,
    email,
    password,
    passwordConfirm,
    ai_type,
    error,
    setNickname,
    setEmail,
    setPassword,
    setPasswordConfirm,
    setError
  } = useAuthStore();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/auth/signUp", {
      method: "POST",
      body: JSON.stringify({
        nickname,
        email,
        password,
        ai_type
      })
    });
    const { user } = await response.json();
    //  TODO: 토스트 컨테이너 스타일 수정하기
    console.log(response);
    if (response.ok) {
      const notify = toast(`${user?.user_metadata?.nickname}님 반갑습니다!`, {
        onClose: () => {
          router.push("/login");
        }
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-11 mb-[90px] text-[30px] font-bold">PAi</h1>
      <form className="md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleSubmitForm}>
        <div className="relative flex flex-col">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="영문, 한글, 숫자 2~10자"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none"
          />
          <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-1/2 transform -translate-y-1/4" />
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="welcome@example.com"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type={!hidePw ? "password" : "text"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="영문, 숫자, 특수문자 포함 6~12자"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          {!hidePw ? (
            <FaRegEyeSlash
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 transform -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePw(!hidePw)}
            />
          ) : (
            <FaRegEye
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 transform -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePw(!hidePw)}
            />
          )}
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type={!hidePwConfirm ? "password" : "text"}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            placeholder="비밀번호 입력"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          {!hidePwConfirm ? (
            <FaRegEyeSlash
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 transform -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePwConfirm(!hidePwConfirm)}
            />
          ) : (
            <FaRegEye
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 transform -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePwConfirm(!hidePwConfirm)}
            />
          )}
        </div>
        <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
        <button className="min-w-[340px] h-12 mt-[124px] mb-2.5 bg-slate-200 rounded-[10px]">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
