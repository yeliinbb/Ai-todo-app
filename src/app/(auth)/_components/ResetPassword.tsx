"use client";

import { useAuthStore } from "@/store/authStore";
import { passwordReg } from "@/lib/utils/auth/authValidation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useThrottle } from "@/hooks/useThrottle";
import PAiLogo from "./PAiLogo";
import InputBox from "./InputBox";
import SubmitBtn from "./SubmitBtn";

const ResetPassword = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const { password, passwordConfirm, error, setPassword, setPasswordConfirm, setError } = useAuthStore();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    const isPasswordValid = passwordReg.test(password);
    const isPasswordConfirmValid = passwordReg.test(passwordConfirm);
    setIsDisabled(!(isPasswordValid && isPasswordConfirmValid));
    // eslint-disable-next-line
  }, [password, passwordConfirm]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setError({ ...error, password: "" });
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    if (!e.target.value) {
      setError({ ...error, passwordConfirm: "" });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    throttle(async () => {
      if (!passwordReg.test(password)) {
        setError({ ...error, password: "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)" });
        return;
      }

      if (!passwordConfirm) {
        setError({ ...error, passwordConfirm: "비밀번호를 입력해주세요." });
        return;
      }

      if (password !== passwordConfirm) {
        setError({ ...error, passwordConfirm: "입력한 비밀번호와 일치하지 않습니다." });
        return;
      }

      if (password === passwordConfirm) {
        const response = await fetch(`/api/auth/resetPassword`, {
          method: "PUT",
          body: JSON.stringify({ password })
        });
        const result = await response.json();

        if (!response.ok) {
          if (result.error === "New password should be different from the old password.") {
            setError({ ...error, password: "이미 사용중인 비밀번호입니다. 새 비밀번호를 입력해주세요" });
            setIsDisabled(true);
            return;
          }
        }
        toast.success("비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      }
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PAiLogo />
      <h3 className="font-extrabold text-xl text-gray-900 mt-1">비밀번호 재설정</h3>
      <h4 className="font-medium text-[15px] text-gray-600 mt-5">새로운 비밀번호를 입력해주세요.</h4>
      <form className="md:w-8/12 relative flex flex-col justify-center text-base mt-11" onSubmit={handlePasswordSubmit}>
        <InputBox
          id={"password"}
          type={!hidePw ? "password" : "text"}
          value={password}
          placeholder="영문, 숫자, 특수문자 포함 6~12자"
          text="비밀번호"
          onChange={handlePasswordChange}
          error={error}
          hidePw={hidePw}
          setHidePw={setHidePw}
        />
        <InputBox
          id={"passwordConfirm"}
          type={!hidePwConfirm ? "password" : "text"}
          value={passwordConfirm}
          placeholder="비밀번호 입력"
          text="비밀번호 확인"
          onChange={handlePasswordConfirmChange}
          error={error}
          hidePw={hidePwConfirm}
          setHidePw={setHidePwConfirm}
        />
        {/* <div className="relative flex flex-col mt-11">
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
        </div> */}
        {/* <button className="min-w-[340px] h-12 mt-[230px] mb-2.5 bg-slate-200 rounded-[10px]">확인</button> */}
        <div className="absolute top-80 -translate-y-1">
          <SubmitBtn type={"submit"} text={"비밀번호 재설정 완료"} isDisabled={isDisabled} />
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
