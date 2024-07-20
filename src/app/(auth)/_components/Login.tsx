"use client";

import React, { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const Login = () => {
  const [hidePw, setHidePw] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-40 mb-14 text-[30px] font-bold">PAi</h1>
      <form className="md:w-8/12 flex flex-col justify-center">
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

        <button className="min-w-[340px] h-10 mt-7 mb-2.5 bg-slate-200 rounded-[10px]">로그인</button>
      </form>
      <p className="mt-4 hover:cursor-pointer">비밀번호 찾기</p>
      <p className="mt-4 mb-9 hover:cursor-pointer">이메일로 가입하기</p>
      <div className="md:w-8/12 relative flex flex-col justify-center items-center border-t border-gray-300">
        <p className="text-center min-w-[150px] absolute bg-white transform -translate-y-9">간편 로그인</p>
        <div className="md:w-8/12 md:gap-24 min-w-[340px] flex justify-center gap-10 mt-8">
          <button className="w-[36px] h-[36px] rounded-full bg-slate-400 hover:bg-slate-500 transition duration-200">
            K
          </button>
          <button className="w-[36px] h-[36px] rounded-full bg-slate-400  hover:bg-slate-500 transition duration-200">
            A
          </button>
          <button className="w-[36px] h-[36px] rounded-full bg-slate-400  hover:bg-slate-500 transition duration-200">
            G
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
