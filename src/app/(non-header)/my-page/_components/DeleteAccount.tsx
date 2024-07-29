"use client";

import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const placeholder = `     서비스 탈퇴 사유에 대해 알려주세요.
 소중한 피드백을 담아 더 나은 서비스로 보답드리겠습니다.`;

const DeleteAccount = () => {
  const router = useRouter();
  const { data, isPending, isError } = useUserData();
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const [isAgreement, setIsAgreement] = useState<boolean>(false);

  const handleDeleteAccount = async () => {
    console.log(feedbackRef?.current?.value);
    if (!isAgreement) {
      toast("회원 탈퇴 유의사항에 동의해주세요.");
      return;
    }
    if (feedbackRef?.current?.value.trim() !== "") {
      const response = await fetch(`/api/myPage/deleteAccount/feedback`, {
        method: "POST",
        body: JSON.stringify({
          content: feedbackRef?.current?.value
        })
      });
      if (response.ok) {
        console.log("피드백 포스트 성공");
      }
    }
    const response = await fetch(`/api/myPage/deleteAccount`, {
      method: "POST",
      body: JSON.stringify({ userId: data?.user_id })
    });

    if (response.ok) {
      console.log("회원탈퇴 성공");
      router.replace("/");
      await fetch(`/api/myPage/logout`);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[343px] flex flex-col relative justify-between mt-16 ml-8 mr-8 font-bold">
          <h1 className="text-2xl mb-2.5">{data?.nickname}님,</h1>
          <h1 className="text-2xl mb-2.5">정말 탈퇴하시겠어요?</h1>
          <h1 className="text-lg mt-5 mb-2.5">떠나시는 이유를 알려주세요.</h1>
          <textarea
            placeholder={placeholder}
            ref={feedbackRef}
            className="min-w-[340px] h-40 p-4 rounded-lg bg-slate-200 text-sm focus:outline-none resize-none"
          />
          <div className="mt-8">
            <p className="text-sm ml-5 mr-5">지금 탈퇴하시면 ~~~를 더이상 이용하실 수 없게 돼요!</p>
            <p className="mt-5 text-sm ml-5 mr-5">
              지금 탈퇴하시면 작성하신 투두와 다이어리 내역도 함께 사라져요. <br className="hidden md:block" /> 추후
              동일 계정으로 재가입하셔도 투두와 다이어리 내역은 복구되지 않아요!
            </p>
          </div>
          <div className="relative">
            <p
              onClick={() => setIsAgreement(!isAgreement)}
              className={`absolute left-5 top-36 text-xs text-gray-400 ${isAgreement ? "text-pai-400" : ""}`}
            >
              회원 탈퇴 유의사항을 확인하였으며, 동의합니다.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="min-w-[340px] w-full h-12  mb-2.5 absolute top-44 -translate-y-2  bg-slate-200 rounded-[10px]"
            >
              회원 탈퇴
            </button>
            <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} closeOnClick={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
