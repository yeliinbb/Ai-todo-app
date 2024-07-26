import React from "react";
import { IoPerson } from "react-icons/io5";

const EditNickname = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[343px] flex flex-col relative justify-between mt-16 ml-8 mr-8 font-bold">
          <h1 className="text-sm mb-2.5">이메일</h1>
          <div className="mt-1">
            <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-1/3 -translate-y-2" />
            <p className="ml-12 text-gray-400">welcome@example.com</p>
          </div>
          <input
            id="nickname"
            type="text"
            placeholder="새 닉네임 입력 (영문, 한글, 숫자 2~10자)"
            className="min-w-[340px] h-12 mt-4 mb-5 border-b-[1px] border-black indent-5 focus:outline-none"
          />
          <p className="absolute top-36 left-2 -translate-y-4 text-[12px] text-red-500">유효성 메세지</p>
          <button className="min-w-[340px] w-full h-12 mt-96 mb-2.5 absolute top-52 -translate-y-2  bg-slate-200 rounded-[10px]">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNickname;
