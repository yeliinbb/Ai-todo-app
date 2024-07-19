import React from "react";
//import { HiOutlineMusicalNote } from "react-icons/hi2";

const SignUp = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="mt-40 mb-14 text-[30px] font-bold">PAi</h1>
      <form className="flex flex-col justify-center">
        <div className="relative flex flex-col">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="영문, 한글, 숫자 2~10자"
            className="min-w-[340px] h-10 mt-1 mb-2.5 bg-slate-200 indent-10 rounded-[10px]"
          />
          {/* <HiOutlineMusicalNote className="absolute left-3 top-1/2 transform -translate-y-1/2" /> */}
        </div>
        <div className="relative">
          {" "}
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" placeholder="welcome@example.com" />
        </div>
        <div className="relative">
          {" "}
          <label>비밀번호</label>
          <input placeholder="영문, 숫자, 특수문자 포함 6~12자" />
        </div>
        <div className="relative">
          <label>비밀번호 확인</label>
          <input placeholder="비밀번호 입력" />
        </div>
        <button>회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
