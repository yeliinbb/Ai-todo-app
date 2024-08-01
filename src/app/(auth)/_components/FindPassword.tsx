"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ResendEmailModal from "./ResendEmailModal";
import { useThrottle } from "@/hooks/useThrottle";
import PAiLogo from "./PAiLogo";
import InputBox from "./InputBox";
import { emailReg } from "@/lib/utils/auth/authValidation";

const FindPassword = () => {
  const throttle = useThrottle();
  const { email, setEmail, error, setError } = useAuthStore();
  const [isEmailExist, setIsEmailExist] = useState<boolean>(true);
  const [isEmailSend, setIsEmailSend] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      setError({ ...error, email: "" });
    };
    // eslint-disable-next-line
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // if (email === "") {
    //   setIsEmailExist(true);
    //   setError({ ...error, email: "" });
    // }
    if (e.target.value.length > 0) {
      setIsEmailExist(true);
      setError({ ...error, email: "" });
    }
  };

  const handleSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    throttle(async () => {
      if (email === "") {
        setError({ ...error, email: "빈칸을 입력해주세요." });
        return;
      }

      if (!emailReg.test(email)) {
        setError({ ...error, email: "잘못된 형식의 이메일 주소입니다." });
        return;
      }

      const reponse = await fetch(`/api/auth/findPassword/${email}`);
      const { isEmailExists } = await reponse.json();

      if (isEmailExists) {
        setIsEmailExist(true);
        setIsEmailSend(true);
        setEmail(email);

        const response = await fetch(`/api/auth/findPassword`, {
          method: "POST",
          body: JSON.stringify({
            email
          })
        });

        if (response.ok) {
          // TODO: 메일 요청 오지 않았다면 다시 요청하라는 멘트 추가? (시간 소요 멘트 추가)
          setEmail(email);
          setIsEmailSend(true);
        }
      } else {
        setIsEmailExist(false);
        setIsEmailSend(false);
        setError({
          ...error,
          email: "해당 이메일과 일치하는 계정이 존재하지 않습니다. "
        });
      }
    }, 2000);
  };

  const handleResendEmailModal = () => {
    console.log("ㅎㅎ");
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PAiLogo />
      {!isEmailSend ? (
        <>
          <h3 className="font-extrabold text-xl text-gray-900">비밀번호를 잊어버리셨나요?</h3>
          <h4 className="font-medium text-sm text-gray-600 mt-3">가입했던 이메일을 입력해주세요.</h4>
          <h4 className="font-medium text-sm text-gray-600 mt-3">비밀번호 재설정메일을 보내드립니다.</h4>
          <form className="md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleSubmitEmail}>
            <InputBox
              text={""}
              id={"email"}
              type={"text"}
              value={email}
              onChange={handleEmailChange}
              placeholder={"welcome@example.com"}
              error={error}
            />
            {/* <div className="relative flex flex-col mt-11 ">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                ref={emailRef}
                onChange={handleEmailChange}
                placeholder="welcome@example.com"
                className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
              />
              <p className="absolute top-20 left-2 -translate-y-2 text-[13px] text-system-error">{error.email}</p>
            </div> */}
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
        <div className="relative flex flex-col items-center">
          <h3 className="text-[20px] mt-40">{email}</h3>
          <h4 className="text-[15px] mt-5">비밀번호 재설정 메일이 발송되었습니다.</h4>
          {/* TODO: 메일 재발송 모달 띄우기 */}
          <p className="text-[15px] absolute top-72 -translate-y-7">메일 도착까지 시간이 소요될 수 있습니다.</p>
          <p onClick={handleResendEmailModal} className="absolute top-full -translate-y-20 hover:cursor-pointer">
            메일이 도착하지 않나요?
          </p>
          {isModalOpen && <ResendEmailModal email={email} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
          <Link href="/login">
            <button
              disabled={!isEmailExist}
              className={`min-w-40 md:w-96 h-12 mt-72 bg-slate-200 rounded-[10px] hover:bg-slate-400 transition duration-200 ${
                isEmailExist === true ? "bg-slate-200" : "bg-slate-400"
              }`}
            >
              확인
            </button>
          </Link>
          <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
        </div>
      )}
    </div>
  );
};

export default FindPassword;
