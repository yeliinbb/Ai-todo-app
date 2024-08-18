"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useThrottle } from "@/hooks/useThrottle";
import InputBox from "./InputBox";
import SubmitBtn from "./SubmitBtn";

const SignUp = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    nickname,
    email,
    password,
    passwordConfirm,
    isOAuth,
    error,
    setNickname,
    setEmail,
    setPassword,
    setPasswordConfirm,
    setError
  } = useAuthStore();

  useEffect(() => {
    setNickname("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setError({ nickname: "", email: "", password: "", passwordConfirm: "" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (nickname && email && password && passwordConfirm) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    // eslint-disable-next-line
  }, [nickname, email, password, passwordConfirm]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, nickname: "" });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, email: "" });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, password: "" });
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, passwordConfirm: "" });
    }
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    throttle(async () => {
      const response = await fetch(`/api/auth/signUp`, {
        method: "POST",
        body: JSON.stringify({
          nickname,
          email,
          password,
          passwordConfirm,
          isOAuth
        })
      });
      const { user, errorMessage } = await response.json();
      if (response.ok) {
        setError({ nickname: "", email: "", password: "", passwordConfirm: "" });
        setIsLoading(false);
        toast.success(
          `${user?.user_metadata?.nickname}님 반갑습니다!`
          //   , {
          //   onClose: () => {
          //     router.push("/login");
          //   }
          // }
        );
        router.push("/login");
      }

      if (!response.ok) {
        setError({
          nickname: errorMessage.nickname,
          email: errorMessage.email,
          password: errorMessage.password,
          passwordConfirm: errorMessage.passwordConfirm
        });
        setIsDisabled(true);
        setIsLoading(false);
      }
    }, 3000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="desktop:block desktop:px-[52px] desktop:py-[60px] desktop:mt-4  hidden">
        <h1 className="text-center leading-7 tracking-[0.8px] text-[32px] font-extrabold text-transparent bg-clip-text bg-gradient-pai400-fai500-br">
          회원가입
        </h1>
      </div>
      <form
        className="desktop:mt-0 md:w-8/12 flex flex-col justify-center text-base mt-16 mb-8"
        onSubmit={handleSubmitForm}
      >
        <InputBox
          text={"닉네임"}
          id={"nickname"}
          type={"text"}
          value={nickname}
          onChange={handleNicknameChange}
          placeholder={"영문, 한글, 숫자 2~10자"}
          error={error}
        />
        <InputBox
          text={"이메일"}
          id={"email"}
          type={"text"}
          value={email}
          onChange={handleEmailChange}
          placeholder={"welcome@example.com"}
          error={error}
        />
        <div className="relative flex flex-col">
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
        </div>
        <div className="relative flex flex-col">
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
        </div>
        <div className="desktop:-mt-7">
          <SubmitBtn text={"회원가입"} type={"submit"} isDisabled={isDisabled} isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default SignUp;

{
  /* <div className="w-full h-full flex flex-col justify-center items-center">
      <form className="md:w-8/12 flex flex-col justify-center text-base mt-16 mb-8" onSubmit={handleSubmitForm}>
        <InputBox
          text={"닉네임"}
          id={"nickname"}
          type={"text"}
          value={nickname}
          onChange={handleNicknameChange}
          placeholder={"영문, 한글, 숫자 2~10자"}
          error={error}
        />
        <InputBox
          text={"이메일"}
          id={"email"}
          type={"text"}
          value={email}
          onChange={handleEmailChange}
          placeholder={"welcome@example.com"}
          error={error}
        />
        <div className="relative flex flex-col">
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
        </div>
        <div className="relative flex flex-col">
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
        </div>
        <SubmitBtn text={"회원가입"} type={"submit"} isDisabled={isDisabled} isLoading={isLoading} />
      </form>
    </div> */
}
