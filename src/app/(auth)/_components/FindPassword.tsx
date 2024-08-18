"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useThrottle } from "@/hooks/useThrottle";
import InputBox from "./InputBox";
import { emailReg } from "@/lib/utils/auth/authValidation";
import SubmitBtn from "./SubmitBtn";
import NextBtn from "@/components/icons/authIcons/NextBtn";
import useModal from "@/hooks/useModal";
import { toast } from "react-toastify";
import NextLargeBtn from "@/components/icons/authIcons/NextLargeBtn";

const FindPassword = () => {
  const throttle = useThrottle();
  const { email, setEmail, error, setError } = useAuthStore();
  const [isEmailExist, setIsEmailExist] = useState<boolean>(false);
  const [isEmailSend, setIsEmailSend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { openModal, Modal } = useModal();

  useEffect(() => {
    if (emailReg.test(email)) {
      setIsEmailExist(true);
    } else {
      setIsEmailExist(false);
    }
    return () => {
      setError({ ...error, email: "" });
    };
    // eslint-disable-next-line
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, email: "" });
    }
  };

  const handleSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    throttle(async () => {
      if (email === "") {
        setError({ ...error, email: "빈칸을 입력해주세요." });
        return;
      }

      if (!emailReg.test(email)) {
        setError({ ...error, email: "잘못된 형식의 이메일 주소입니다." });
        return;
      }

      const response = await fetch(`/api/auth/findPassword/${email}`);
      const { isEmailExists } = await response.json();

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
          setEmail(email);
          setIsEmailSend(true);
          setIsLoading(false);
        }
      } else {
        setIsEmailExist(false);
        setIsEmailSend(false);
        setIsLoading(false);
        setError({
          ...error,
          email: "해당 이메일과 일치하는 계정이 존재하지 않습니다. "
        });
      }
    }, 2000);
  };

  const handleResendBtn = useCallback(() => {
    throttle(async () => {
      try {
        const response = await fetch(`/api/auth/findPassword`, {
          method: "POST",
          body: JSON.stringify({ email })
        });
        if (response.ok) {
          toast.success("메일함을 확인해주세요.");
        } else {
          toast.warn("1분 이후 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }, 1000);

    // eslint-disable-next-line
  }, [email, throttle]);

  const handleResendEmailModal = () => {
    openModal(
      {
        message: "비밀번호 재설정 메일을 재발송할까요?",
        confirmButton: { text: "재발송", style: "시스템" }
      },
      handleResendBtn
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {!isEmailSend ? (
        <div className=" desktop:justify-center relative flex flex-col items-center mt-44 mb-8">
          <h3 className="desktop:text-[32px] desktop:mt-24 desktop:mb-5 font-extrabold text-2xl text-gray-900">
            비밀번호를 잊어버리셨나요?
          </h3>
          <h4 className="desktop:text-[22px] desktop:mb-1 font-medium text-sm text-gray-600 mt-3">
            가입했던 이메일을 입력해주세요.
          </h4>
          <h4 className="desktop:text-[22px] font-medium text-sm text-gray-600 mt-3">
            비밀번호 재설정 메일을 보내드립니다.
          </h4>
          <form className="desktop:mt-3 md:w-8/12 flex flex-col justify-center text-base" onSubmit={handleSubmitEmail}>
            <InputBox
              text={""}
              id={"email"}
              type={"text"}
              value={email}
              onChange={handleEmailChange}
              placeholder={"welcome@example.com"}
              error={error}
            />
            <div className="desktop:mt-44 mt-28">
              <SubmitBtn type={"submit"} text={"재설정 메일 보내기"} isDisabled={!isEmailExist} isLoading={isLoading} />
            </div>
          </form>
        </div>
      ) : (
        <div className="relative flex flex-col items-center mt-40 mb-8">
          <h3 className="desktop:text-[32px] desktop:mt-44 desktop:mb-5 text-xl mt-20 text-pai-400 font-extrabold leading-7 tracking-[0.8px]">
            {email}
          </h3>
          <h4 className="desktop:text-[22px] desktop:mb-1 text-sm mt-5 text-gray-600 font-medium leading-7 tracking-[0.8px]">
            비밀번호 재설정 메일이 발송되었습니다.
          </h4>
          <p className="desktop:text-[22px] desktop:mb-3 text-sm mt-3 text-gray-600 font-medium leading-7 tracking-[0.8px]">
            (이메일 도착까지 시간이 소요될 수 있습니다.)
          </p>
          <div
            onClick={handleResendEmailModal}
            className="desktop:text-lg desktop:mt-64 min-w-[263px] min-h-11 z-10 flex justify-center items-center hover:cursor-pointer text-sm text-gray-600 font-medium mt-[150px]"
          >
            <p className="mr-1">이메일이 도착하지 않나요?</p>
            <div className="desktop:hidden block">
              <NextBtn />
            </div>
            <div className="desktop:block hidden">
              <NextLargeBtn />
            </div>
          </div>
          <Modal />
          <div className="-mt-11 flex justify-center items-center gap-2.5 z-1">
            <Link href="/login">
              <SubmitBtn type={"button"} text={"확인"} isDisabled={!isEmailExist} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPassword;
