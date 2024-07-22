"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const SITE_URL = "http://localhost:3000";

const FindPassword = () => {
  const { error, setError } = useAuthStore();
  const [isEmailExist, setIsEmailExist] = useState<boolean>(true);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError({ ...error, email: "" });
  }, []);

  const handleEmailChange = () => {
    if (emailRef?.current?.value === "") {
      setIsEmailExist(true);
      setError({ ...error, email: "" });
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emaildata = await fetch(`${SITE_URL}/api/auth/findPassword`, {
      method: "GET"
    });
    const emailList: string[] = await emaildata.json();
    console.log(emailList);
    const email = emailList.find((email) => email === emailRef?.current?.value);

    if (email) {
      setIsEmailExist(true);
      const response = await fetch(`${SITE_URL}/api/auth/findPassword`, {
        method: "POST",
        body: JSON.stringify({
          email: emailRef?.current?.value
        })
      });
      const result = await response.json();
      if (response.ok) {
        toast("메일함을 확인해주세요.");
      }
    } else {
      setIsEmailExist(false);
      setError({
        ...error,
        email: "해당 이메일과 일치하는 계정이 존재하지 않습니다. "
      });
      // TODO: UX면에서 인풋값을 지우는 게 좋을지??
      // if (emailRef.current) {
      //   emailRef.current.value = "";
      // }
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-11 mb-11 text-[30px] font-bold">PAi</h1>
      <h3 className="text-[20px]">등록된 이메일을 입력해주세요.</h3>
      <h4 className="text-[15px] mt-5">비밀번호 재설정을 위한 메일을 보내드립니다.</h4>
      <form className="md:w-8/12 flex flex-col justify-centertext-base" onSubmit={handleSubmitEmail}>
        <div className="relative flex flex-col mt-11 ">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            ref={emailRef}
            onChange={handleEmailChange}
            placeholder="welcome@example.com"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 transform -translate-y-2 text-[15px]">{error.email}</p>
        </div>
        <div className="min-w-[340px] mt-80 flex justify-between gap-2.5">
          <Link href="/login">
            <button
              type="button"
              className="min-w-40 md:w-96 h-12 bg-slate-200 rounded-[10px] hover:bg-slate-400 transition duration-200"
            >
              로그인으로 이동
            </button>
          </Link>
          <button
            disabled={!isEmailExist}
            className={`min-w-40 md:w-96 h-12 bg-slate-200 rounded-[10px] hover:bg-slate-400 transition duration-200 ${
              isEmailExist === true ? "bg-slate-200" : "bg-slate-400"
            }`}
          >
            확인
          </button>
          <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
        </div>
      </form>
    </div>
  );
};

export default FindPassword;
