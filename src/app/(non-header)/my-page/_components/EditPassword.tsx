"use client";

import { useAuthStore } from "@/store/authStore";
import { passwordReg } from "@/lib/utils/auth/authValidation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useThrottle } from "@/hooks/useThrottle";
import SubmitBtn from "@/app/(auth)/_components/SubmitBtn";
import InputBox from "@/app/(auth)/_components/InputBox";
import useModal from "@/hooks/useModal";

const EditPassword = () => {
  const { password, passwordConfirm, error, setPassword, setPasswordConfirm, setError } = useAuthStore();
  const router = useRouter();
  const throttle = useThrottle();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { openModal, Modal } = useModal();

  useEffect(() => {
    if (password || passwordConfirm) {
      setPassword("");
      setPasswordConfirm("");
    }
    return () => {
      setError({ ...error, password: "", passwordConfirm: "" });
      setPassword("");
      setPasswordConfirm("");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (password && passwordConfirm) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    // eslint-disable-next-line
  }, [password, passwordConfirm]);

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (password) {
      if (password.length > 0) {
        setError({ ...error, password: "" });
      }
    }
  };

  const handlePasswordConfirmChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    if (passwordConfirm) {
      if (passwordConfirm.length > 0) {
        setError({ ...error, passwordConfirm: "" });
      }
    }
  };

  const handlePasswordEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    throttle(async () => {
      if (password && passwordConfirm) {
        if (!passwordReg.test(password)) {
          setError({ ...error, password: "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)" });
          setIsDisabled(true);
          return;
        }

        if (!passwordConfirm) {
          setError({ ...error, passwordConfirm: "비밀번호를 입력해주세요." });
          setIsDisabled(true);
          return;
        }

        if (password !== passwordConfirm) {
          setError({ ...error, passwordConfirm: "입력한 비밀번호와 일치하지 않습니다." });
          setIsDisabled(true);
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
              setError({ ...error, password: "이미 사용중인 비밀번호입니다. 새 비밀번호를 입력해주세요." });
              setIsDisabled(true);
              return;
            }
          }
          setError({ ...error, password: "", passwordConfirm: "" });
          openModal(
            {
              message: "비밀번호가 변경되었습니다.",
              confirmButton: { text: "확인", style: "시스템" }
            },
            () => router.push("/my-page")
          );
        }
      }
    }, 2000);
  };

  return (
    <div className="w-full h-full desktop:flex desktop:flex-col desktop:justify-center desktop:items-center ">
      <div className="desktop:pb-0 desktop:min-h-[calc(100%-300px)] flex flex-col justify-center items-center pb-[130px]">
        <Modal />
        <div className="desktop:mt-24 min-w-[343px] min-h-[calc(100%-700px)] flex flex-col relative justify-between ml-8 mr-8 font-bold">
          <h1 className="desktop:text-[22px] text-center text-gray-600 text-base font-bold mt-16 mb-11">
            새로운 비밀번호를 입력해주세요.
          </h1>
          <form className="desktop:mt-4 relative flex flex-col" onSubmit={handlePasswordEdit}>
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
            <div className="mt-32">
              <SubmitBtn text={"변경"} type={"submit"} isDisabled={isDisabled} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
