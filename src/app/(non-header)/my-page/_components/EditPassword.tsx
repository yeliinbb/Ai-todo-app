"use client";

import { useAuthStore } from "@/store/authStore";
import { IoPerson } from "react-icons/io5";

const EditPassword = () => {
  const { error, setError } = useAuthStore();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[343px]  flex flex-col relative justify-between mt-16 ml-8 mr-8 font-bold">
          <h1 className="text-sm mb-2.5">이메일</h1>
          <div className="mt-1">
            <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-12 -translate-y-2" />
            <p className="ml-12 text-gray-400">welcome@example.com</p>
          </div>
          <form className="relative flex flex-col">
            <input
              id="nickname"
              type="text"
              placeholder="새 비밀번호 입력 (영문, 숫자, 큭수문자 포함 6~12자)"
              className="min-w-[340px] h-12 mt-4 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
            />
            <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">{error.password}</p>
            <input
              id="nickname"
              type="text"
              placeholder="새 비밀번호 확인"
              className="min-w-[340px] h-12 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
            />
            <p className="absolute top-40 left-2 -translate-y-6 text-[12px] text-red-500">{error.passwordConfirm}</p>
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
