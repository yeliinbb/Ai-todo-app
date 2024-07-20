import Link from "next/link";
import React from "react";

const FindPassword = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-11 mb-11 text-[30px] font-bold">PAi</h1>
      <h3 className="text-[20px]">등록된 이메일을 입력해주세요.</h3>
      <h4 className="text-[15px] mt-5">비밀번호 재설정을 위한 메일을 보내드립니다.</h4>
      <form className="md:w-8/12 flex flex-col justify-centertext-base">
        <div className="relative flex flex-col mt-11 ">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="welcome@example.com"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
        </div>
        <div className="min-w-[340px] mt-80 flex justify-between gap-2.5">
          <Link href="/login">
            <button className="min-w-40 md:w-96 h-12 bg-slate-200 rounded-[10px] hover:bg-slate-400 transition duration-200">
              로그인으로 이동
            </button>
          </Link>
          <button className="min-w-40 md:w-96 h-12 bg-slate-200 rounded-[10px] hover:bg-slate-400 transition duration-200">
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default FindPassword;
