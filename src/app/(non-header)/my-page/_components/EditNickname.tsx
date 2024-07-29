"use client";

import { useUserData } from "@/hooks/useUserData";
import { useAuthStore } from "@/store/authStore";
import { Auth } from "@/types/auth.type";
import { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { IoPerson } from "react-icons/io5";

const EditNickname = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { error, setError } = useAuthStore();
  const nicknameRef = useRef<HTMLInputElement>(null);
  const { data, isPending, isError } = useUserData();
  type DataType = Exclude<typeof data, undefined>; // "exclude" 유니언타입 ts핸드북 참고하기 (union타입 핸들링)

  const handleNicknameEdit = async (
    nicknameRef: React.RefObject<HTMLInputElement>,
    data: Pick<Auth, "user_id" | "nickname" | "isOAuth">
  ) => {
    if (nicknameRef.current) {
      const response = await fetch("/api/myPage/nickname", {
        method: "PUT",
        body: JSON.stringify({
          newNickname: nicknameRef?.current?.value,
          userId: data?.user_id,
          isOAuth: data?.isOAuth
        })
      });
      if (response.ok) {
        return true;
      } else {
        throw new Error("Failed to update nickname");
      }
    }
  };

  const { mutate: editNickname } = useMutation({
    mutationFn: () => handleNicknameEdit(nicknameRef, data as Pick<DataType, "user_id" | "nickname" | "isOAuth">),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // TODO: 닉네임이 변경되었습니다 ~~
      router.push("/my-page");
    }
  });

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[343px] flex flex-col relative justify-between mt-16 ml-8 mr-8 font-bold">
          <h1 className="text-sm mb-2.5">이메일</h1>
          <div className="mt-1">
            <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-1/3 -translate-y-2" />
            <p className="ml-12 text-gray-400">{data?.email}</p>
          </div>
          <input
            id="nickname"
            type="text"
            ref={nicknameRef}
            placeholder="새 닉네임 입력 (영문, 한글, 숫자 2~10자)"
            className="min-w-[340px] h-12 mt-4 mb-5 border-b-[1px] border-black indent-2 text-sm focus:outline-none"
          />
          <p className="absolute top-36 left-2 -translate-y-4 text-[12px] text-red-500">{error.nickname}</p>
          <button
            onClick={() => editNickname()}
            className="min-w-[340px] w-full h-12 mt-96 mb-2.5 absolute top-52 -translate-y-2  rounded-[10px]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNickname;
