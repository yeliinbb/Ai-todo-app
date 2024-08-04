"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useThrottle } from "@/hooks/useThrottle";
import InputBox from "./InputBox";
import PAiLogo from "./PAiLogo";
import SubmitBtn from "./SubmitBtn";

const SignUp = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
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
      //  TODO: 토스트 컨테이너 스타일 수정하기
      if (response.ok) {
        setError({ nickname: "", email: "", password: "", passwordConfirm: "" });
        toast.success(`${user?.user_metadata?.nickname}님 반갑습니다!`, {
          onClose: () => {
            router.push("/login");
          }
        });
      }

      if (!response.ok) {
        setError({
          nickname: errorMessage.nickname,
          email: errorMessage.email,
          password: errorMessage.password,
          passwordConfirm: errorMessage.passwordConfirm
        });
        setIsDisabled(true);
      }
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PAiLogo />
      <form className="md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleSubmitForm}>
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

        {/* <div className="relative flex flex-col">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="영문, 한글, 숫자 2~10자"
            className="min-w-[343px] h- mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none"
          />
          <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">{error.nickname}</p>
        </div> */}
        {/* <div className="relative flex flex-col">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="welcome@example.com"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">{error.email}</p>
        </div> */}
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
          {/* <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type={!hidePw ? "password" : "text"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="영문, 숫자, 특수문자 포함 6~12자"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">{error.password}</p>
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
          )} */}
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
          {/* <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type={!hidePwConfirm ? "password" : "text"}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            placeholder="비밀번호 입력"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none "
          />
          <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">{error.passwordConfirm}</p>
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
          )} */}
        </div>
        <SubmitBtn text={"회원가입"} type={"submit"} isDisabled={isDisabled} />
      </form>
    </div>
  );
};

export default SignUp;
