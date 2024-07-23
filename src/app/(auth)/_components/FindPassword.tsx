"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const SITE_URL = "http://localhost:3000";

const FindPassword = () => {
  const { email, setEmail, error, setError } = useAuthStore();
  const [isEmailExist, setIsEmailExist] = useState<boolean>(true);
  const [isEmailSend, setIsEmailSend] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError({ ...error, email: "" });
    //setIsEmailSend(false);
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
    const email = emailList?.find((email) => email === emailRef?.current?.value);

    if (email) {
      setIsEmailExist(true);
      setIsEmailSend(true);
      if (emailRef.current) {
        setEmail(emailRef?.current?.value);
      }
      const response = await fetch(`${SITE_URL}/api/auth/findPassword`, {
        method: "POST",
        body: JSON.stringify({
          email: emailRef?.current?.value
        })
      });

      if (response.ok) {
        // TODO: 메일 요청 오지 않았다면 다시 요청하라는 멘트 추가? (시간 소요 멘트 추가)
        if (emailRef.current) {
          setEmail(emailRef?.current?.value);
        }
        setIsEmailSend(true);
      }
    } else {
      setIsEmailExist(false);
      setIsEmailSend(false);
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
      {!isEmailSend ? (
        <>
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
        </>
      ) : (
        <>
          <h3 className="text-[20px] mt-48">{email}</h3>
          <h4 className="text-[15px] mt-5">비밀번호 재설정 메일이 발송되었습니다.</h4>
          <Link href="/login">
            <button
              disabled={!isEmailExist}
              className={`min-w-40 md:w-96 h-12 mt-64 bg-slate-200 rounded-[10px] hover:bg-slate-400 transition duration-200 ${
                isEmailExist === true ? "bg-slate-200" : "bg-slate-400"
              }`}
            >
              확인
            </button>
          </Link>
          <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
        </>
      )}
    </div>
  );
};

export default FindPassword;
