"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const { password, error, setPassword, setError } = useAuthStore();
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // TODO: 유효성 검사 로직 추가
  };

  const handlePasswordConfirmChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!passwordConfirmRef?.current?.value) {
      setError({ ...error, passwordConfirm: "" });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordConfirmRef?.current?.value) {
      setError({ ...error, passwordConfirm: "비밀번호를 입력해주세요." });
      return;
    }

    if (password !== passwordConfirmRef?.current?.value) {
      setError({ ...error, passwordConfirm: "입력한 비밀번호와 일치하지 않습니다." });
      return;
    }

    if (password === passwordConfirmRef.current.value) {
      await fetch(`/api/auth/resetPassword`, {
        method: "PUT",
        body: JSON.stringify({ password })
      });
      toast("비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="mt-11 mb-11 text-[30px] font-bold">PAi</h1>
      <h3 className="text-[20px]">비밀번호 재설정</h3>
      <h4 className="text-[15px] mt-5">새로운 비밀번호를 입력해주세요.</h4>
      <form className="md:w-8/12 flex flex-col justify-centertext-base" onSubmit={handlePasswordSubmit}>
        <div className="relative flex flex-col mt-11">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type={!hidePw ? "password" : "text"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="영문, 숫자, 특수문자 포함 6~12자"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 -translate-y-2 text-[12px] text-red-500">{error.password}</p>
          {!hidePw ? (
            <FaRegEyeSlash
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePw(!hidePw)}
            />
          ) : (
            <FaRegEye
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePw(!hidePw)}
            />
          )}
        </div>
        <div className="relative flex flex-col">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type={!hidePwConfirm ? "password" : "text"}
            ref={passwordConfirmRef}
            onChange={handlePasswordConfirmChange}
            placeholder="비밀번호 입력"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 -translate-y-2 text-[12px] text-red-500">{error.passwordConfirm}</p>
          {!hidePwConfirm ? (
            <FaRegEyeSlash
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePwConfirm(!hidePwConfirm)}
            />
          ) : (
            <FaRegEye
              color="#9a9a9a"
              className="w-[20px] h-[20px] absolute right-3.5 top-1/2 -translate-y-1/4 hover:cursor-pointer"
              onClick={() => setHidePwConfirm(!hidePwConfirm)}
            />
          )}
        </div>
        <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
        <button className="min-w-[340px] h-12 mt-[230px] mb-2.5 bg-slate-200 rounded-[10px]">확인</button>
      </form>
    </div>
  );
};

export default ResetPassword;
