"use client";

import React, { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const SignUp = () => {
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-40 mb-14 text-[30px] font-bold">PAi</h1>
      <form className="md:w-8/12 flex flex-col justify-center">
        <div className="relative flex flex-col">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="영문, 한글, 숫자 2~10자"
            className="min-w-[340px] h-10 mt-1 mb-4 bg-slate-200 indent-10 rounded-[10px] focus:outline-none"
          />
          <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-1/2 transform -translate-y-1/4" />
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="welcome@example.com"
            className="min-w-[340px] h-10 mt-1 mb-4 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type={!hidePw ? "password" : "text"}
            placeholder="영문, 숫자, 특수문자 포함 6~12자"
            className="min-w-[340px] h-10 mt-1 mb-4 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
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
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type={!hidePwConfirm ? "password" : "text"}
            placeholder="비밀번호 입력"
            className="min-w-[340px] h-10 mt-1 mb-4 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
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
        <button className="min-w-[340px] h-10 mt-7 mb-2.5 bg-slate-200 rounded-[10px]">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
