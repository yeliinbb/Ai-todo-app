"use client";

import { useUserData } from "@/hooks/useUserData";
import { useAuthStore } from "@/store/authStore";
import { Auth } from "@/types/auth.type";
import { nicknameReg } from "@/lib/utils/auth/authValidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubmitBtn from "@/app/(auth)/_components/SubmitBtn";
import InputBox from "@/app/(auth)/_components/InputBox";
import useModal from "@/hooks/useModal";

const EditNickname = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { nickname, setNickname, error, setError } = useAuthStore();
  const { data, isPending, isError } = useUserData();
  const { openModal, Modal } = useModal();
  type DataType = Exclude<typeof data, undefined>; // "exclude" 유니언타입 ts핸드북 참고하기 (union타입 핸들링)

  useEffect(() => {
    setError({ ...error, nickname: "" });
    // eslint-disable-next-line
  }, []);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (e.target.value.length > 0) {
      setError({ ...error, nickname: "" });
      setIsDisabled(false);
    }
    if (e.target.value === "") {
      setIsDisabled(true);
    }
  };

  const handleNicknameEdit = async (nickname: string, data: Pick<Auth, "user_id" | "nickname" | "isOAuth">) => {
    if (nickname.length === 0) {
      setError({ ...error, nickname: "빈칸을 입력해주세요." });
      setIsDisabled(true);
      return;
    }
    if (nickname) {
      if (!nicknameReg.test(nickname)) {
        setError({ ...error, nickname: "영문, 한글, 숫자 2~10자로 작성해주세요." });
        setIsDisabled(true);
        return;
      }

      const response = await fetch("/api/myPage/nickname", {
        method: "PUT",
        body: JSON.stringify({
          newNickname: nickname,
          userId: data?.user_id,
          isOAuth: data?.isOAuth
        })
      });

      const result = await response.json();
      if (!response.ok) {
        console.log(result);
        return;
      }
      openModal(
        {
          message: "닉네임이 변경되었습니다.",
          confirmButton: { text: "확인", style: "시스템" }
        },
        () => router.push("/my-page")
      );

      if (response.ok) {
        return true;
      } else {
        throw new Error("Failed to update nickname");
      }
    }
  };

  const { mutate: editNickname } = useMutation({
    mutationFn: () => handleNicknameEdit(nickname, data as Pick<DataType, "user_id" | "nickname" | "isOAuth">),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  return (
    <div className="w-full h-full desktop:flex desktop:flex-col desktop:justify-center desktop:items-center">
      <Modal />
      <div className="desktop:mt-64 min-h-[calc(100%-400px)] flex flex-col justify-center items-center mt-11">
        <InputBox
          text={`현재 닉네임: ${data?.nickname}`}
          id={"nickname"}
          type={"text"}
          value={nickname}
          onChange={handleNicknameChange}
          placeholder={"영문, 한글, 숫자 2~10자"}
          error={error}
          setNickname={setNickname}
        />
        <div onClick={() => editNickname()} className="desktop:mt-64 desktop:pb-0 mt-80 pb-36">
          <SubmitBtn text={"변경"} type={"button"} isDisabled={isDisabled} />
        </div>
      </div>
    </div>
  );
};

export default EditNickname;
