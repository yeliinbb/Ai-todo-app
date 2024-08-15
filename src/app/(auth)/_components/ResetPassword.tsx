"use client";

import { useAuthStore } from "@/store/authStore";
import { passwordReg } from "@/lib/utils/auth/authValidation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useThrottle } from "@/hooks/useThrottle";
import InputBox from "./InputBox";
import SubmitBtn from "./SubmitBtn";

const ResetPassword = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const { password, passwordConfirm, error, setPassword, setPasswordConfirm, setError } = useAuthStore();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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
        await fetch(`/api/auth/resetPassword`);

        const response = await fetch(`/api/auth/resetPassword`, {
          method: "PUT",
          body: JSON.stringify({ password })
        });
        const result = await response.json();

        if (!response.ok) {
          toast.error("비밀번호 변경에 실패하였습니다.");
          if (result.error === "New password should be different from the old password.") {
            setError({ ...error, password: "이미 사용중인 비밀번호입니다. 새 비밀번호를 입력해주세요" });
            setIsDisabled(true);
            return;
          }
        }
        if (response.ok) {
          setIsSuccess(true);
          toast.success("비밀번호가 변경되었습니다.");
        }
      }
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-24  mb-8">
      {!isSuccess ? (
        <>
          <h3 className="desktop:text-[32px] desktop:mt-20 font-extrabold text-xl text-gray-900 mt-1">
            비밀번호 재설정
          </h3>
          <h4 className="desktop:text-[22px] desktop:mt-8 font-medium text-[15px] text-gray-600 mt-4">
            새로운 비밀번호를 입력해주세요.
          </h4>
          <form
            className="desktop:mt-16 md:w-8/12 relative flex flex-col justify-center text-base mt-11"
            onSubmit={handlePasswordSubmit}
          >
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
              placeholder="비밀번호를 한 번 더 입력해주세요"
              text="비밀번호 확인"
              onChange={handlePasswordConfirmChange}
              error={error}
              hidePw={hidePwConfirm}
              setHidePw={setHidePwConfirm}
            />
            <div className="desktop:mt-24 mt-16">
              <SubmitBtn type={"submit"} text={"완료"} isDisabled={isDisabled} />
            </div>
          </form>
        </>
      ) : (
        <>
          <h1 className="desktop:text-[32px] desktop:mt-64 text-pai-400 font-extrabold text-xl leading-7 mt-32">
            비밀번호가 변경되었습니다.
          </h1>
          <p className="desktop:text-[22px] desktop:mt-8 desktop:mb-2 mt-[14px] text-gray-600 font-medium text-sm leading-7">
            새로운 비밀번호로 로그인해주세요.
          </p>
          <div className="desktop:mt-72 mt-48" onClick={() => router.replace("/login")}>
            <SubmitBtn text="로그인 하러가기" type={"button"} />
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
