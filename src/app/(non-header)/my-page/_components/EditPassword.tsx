"use client";

import { useUserData } from "@/hooks/useUserData";
import { useAuthStore } from "@/store/authStore";
import { passwordReg } from "@/lib/utils/auth/authValidation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { toast } from "react-toastify";
import { useThrottle } from "@/hooks/useThrottle";
import SubmitBtn from "@/app/(auth)/_components/SubmitBtn";
import Invisible from "@/components/icons/authIcons/Invisible";
import Visible from "@/components/icons/authIcons/Visible";

const EditPassword = () => {
  const { error, setError } = useAuthStore();
  const { data, isPending, isError } = useUserData();
  const router = useRouter();
  const throttle = useThrottle();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      setError({ ...error, password: "", passwordConfirm: "" });
    };
    // eslint-disable-next-line
  }, []);

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordRef?.current) {
      if (passwordRef?.current?.value.length > 0) {
        setError({ ...error, password: "" });
      }
    }
  };

  const handlePasswordConfirmChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordConfirmRef?.current) {
      if (passwordConfirmRef?.current?.value.length > 0) {
        setError({ ...error, passwordConfirm: "" });
      }
    }
  };

  const handlePasswordEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    throttle(async () => {
      if (passwordRef.current && passwordConfirmRef.current) {
        if (!passwordReg.test(passwordRef.current.value)) {
          setError({ ...error, password: "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)" });
          return;
        }

        if (!passwordConfirmRef?.current?.value) {
          setError({ ...error, passwordConfirm: "비밀번호를 입력해주세요." });
          return;
        }

        if (passwordRef.current.value !== passwordConfirmRef?.current?.value) {
          setError({ ...error, passwordConfirm: "입력한 비밀번호와 일치하지 않습니다." });
          return;
        }

        if (passwordRef.current.value === passwordConfirmRef.current.value) {
          const response = await fetch(`/api/auth/resetPassword`, {
            method: "PUT",
            body: JSON.stringify({ password: passwordRef.current.value })
          });
          const result = await response.json();

          if (!response.ok) {
            if (result.error === "New password should be different from the old password.") {
              setError({ ...error, password: "이미 사용중인 비밀번호입니다. 새 비밀번호를 입력해주세요" });
              return;
            }
          }
          toast.success("비밀번호가 변경되었습니다. 마이페이지로 이동합니다.");
          setError({ ...error, password: "", passwordConfirm: "" });
          router.push("/my-page");
        }
      }
    }, 2000);
  };

  return (
    <div className="w-full h-full ">
      <div className="md:w-8/12 h-screen flex flex-col justify-center items-center">
        <div className="min-w-[343px] min-h-[calc(100%-700px)] flex flex-col relative justify-between ml-8 mr-8 font-bold">
          <h1 className="text-sm mb-2.5">이메일</h1>
          <div className="mt-1">
            <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-12 -translate-y-2" />
            <p className="ml-12 text-gray-400">{data?.email}</p>
          </div>
          <form className="relative flex flex-col" onSubmit={handlePasswordEdit}>
            <input
              id="password"
              type={!hidePw ? "password" : "text"}
              ref={passwordRef}
              onChange={handlePasswordChange}
              placeholder="새 비밀번호 입력 (영문, 숫자, 특수문자 포함 6~12자)"
              className="min-w-[340px] h-12 mt-4 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
            />
            <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-system-error">{error.password}</p>
            {!hidePw ? (
              <div
                onClick={() => setHidePw(!hidePw)}
                className="w-[20px] h-[20px] absolute right-3.5 top-9 -translate-y-2 hover:cursor-pointer"
              >
                <Invisible />
              </div>
            ) : (
              <div
                onClick={() => setHidePw(!hidePw)}
                className="w-[20px] h-[20px] absolute right-3.5 top-9 -translate-y-2 hover:cursor-pointer"
              >
                <Visible />
              </div>
            )}
            <input
              id="passwordConfirm"
              type={!hidePwConfirm ? "password" : "text"}
              ref={passwordConfirmRef}
              onChange={handlePasswordConfirmChange}
              placeholder="새 비밀번호 확인"
              className="min-w-[340px] h-12 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
            />
            <p className="absolute top-40 left-2 -translate-y-6 text-[12px] text-system-error">
              {error.passwordConfirm}
            </p>
            {!hidePwConfirm ? (
              <div
                onClick={() => setHidePwConfirm(!hidePwConfirm)}
                className="w-[20px] h-[20px] absolute right-3.5 top-28 -translate-y-4 hover:cursor-pointer"
              >
                <Invisible />
              </div>
            ) : (
              <div
                onClick={() => setHidePwConfirm(!hidePwConfirm)}
                className="w-[20px] h-[20px] absolute right-3.5 top-28 -translate-y-4 hover:cursor-pointer"
              >
                <Visible />
              </div>
            )}
            <div className="mt-56">
              <SubmitBtn text={"확인"} type={"submit"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
