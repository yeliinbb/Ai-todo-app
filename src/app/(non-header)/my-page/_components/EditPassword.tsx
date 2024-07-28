"use client";

import { useUserData } from "@/hooks/useUserData";
import { useAuthStore } from "@/store/authStore";
import { useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

const EditPassword = () => {
  const { error, setError } = useAuthStore();
  const { data, isPending, isError } = useUserData();
  const [hidePw, setHidePw] = useState<boolean>(false);
  const [hidePwConfirm, setHidePwConfirm] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const handlePasswordEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordRef.current && passwordConfirmRef.current) {
      console.log(passwordRef.current.value, passwordConfirmRef.current.value);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[343px]  flex flex-col relative justify-between mt-16 ml-8 mr-8 font-bold">
          <h1 className="text-sm mb-2.5">이메일</h1>
          <div className="mt-1">
            <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-12 -translate-y-2" />
            <p className="ml-12 text-gray-400">{data?.user?.email}</p>
          </div>
          <form className="relative flex flex-col" onSubmit={handlePasswordEdit}>
            <input
              id="password"
              type={!hidePw ? "password" : "text"}
              ref={passwordRef}
              placeholder="새 비밀번호 입력 (영문, 숫자, 특수문자 포함 6~12자)"
              className="min-w-[340px] h-12 mt-4 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
            />
            <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">{error.password}</p>
            {!hidePw ? (
              <FaRegEyeSlash
                color="#9a9a9a"
                className="w-[20px] h-[20px] absolute right-3.5 top-1/3 -translate-y-1/3 hover:cursor-pointer"
                onClick={() => setHidePw(!hidePw)}
              />
            ) : (
              <FaRegEye
                color="#9a9a9a"
                className="w-[20px] h-[20px] absolute right-3.5 top-1/3 -translate-y-1/3 hover:cursor-pointer"
                onClick={() => setHidePw(!hidePw)}
              />
            )}
            <input
              id="passwordConfirm"
              type={!hidePwConfirm ? "password" : "text"}
              ref={passwordConfirmRef}
              placeholder="새 비밀번호 확인"
              className="min-w-[340px] h-12 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
            />
            <p className="absolute top-40 left-2 -translate-y-6 text-[12px] text-red-500">{error.passwordConfirm}</p>
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
            <button className="min-w-[340px] w-full h-12 mt-80 mb-2.5 absolute top-52 -translate-y-1  bg-slate-200 rounded-[10px]">
              확인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
