"use client";

import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const ResetPassword = () => {
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-11 mb-11 text-[30px] font-bold">PAi</h1>
      <h3 className="text-[20px]">비밀번호 재설정</h3>
      <h4 className="text-[15px] mt-5">새로운 비밀번호를 입력해주세요.</h4>
      <form className="md:w-8/12 flex flex-col justify-centertext-base">
        <div className="relative flex flex-col mt-11">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type={!hidePw ? "password" : "text"}
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
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type={!hidePwConfirm ? "password" : "text"}
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
        <button className="min-w-[340px] h-12 mt-[230px] mb-2.5 bg-slate-200 rounded-[10px]">확인</button>
      </form>
    </div>
  );
};

export default ResetPassword;
