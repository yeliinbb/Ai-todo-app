"use client";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TodoProgressBar from "./TodoProgressBar";
import { useThrottle } from "@/hooks/useThrottle";
import { toast } from "react-toastify";
import EmailSmall from "@/components/icons/myPage/EmailSmall";
import NicknameSmall from "@/components/icons/myPage/NicknameSmall";
import PasswordSmall from "@/components/icons/myPage/PasswordSmall";
import NextBtn from "@/components/icons/authIcons/NextBtn";
import NonLoggedIn from "./NonLoggedIn";
import { useQueryClient } from "@tanstack/react-query";
import useModal from "@/hooks/useModal";
import { useEffect, useState } from "react";
import SubmitBtn from "@/app/(auth)/_components/SubmitBtn";

const MyInfo = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const queryClient = useQueryClient();
  const { openModal, Modal } = useModal();
  const { data, isPending, isError } = useUserData();
  if (isPending) return <p className="w-full h-screen flex justify-center items-center -mt-28">Loading...</p>;

  const logout = () => {
    throttle(async () => {
      const response = await fetch("/api/myPage/logout");
      if (response.ok) {
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.success("로그아웃 되었습니다.");
        router.replace("/login");
      } else {
        toast.error("로그아웃을 다시 시도해주세요.");
      }
    }, 1000);
  };

  const handleLogoutBtn = () => {
    openModal(
      {
        message: "로그아웃 하시겠어요?",
        confirmButton: { text: "확인", style: "시스템" },
        cancelButton: { text: "취소", style: "취소" }
      },
      logout
    );
    // throttle(async () => {
    //   const response = await fetch("/api/myPage/logout");
    //   if (response.ok) {
    //     queryClient.removeQueries({ queryKey: ["user"] });
    //     // toast.success("로그아웃 되었습니다.");
    //     // router.replace("/login");
    //   } else {
    //     toast.error("로그아웃을 다시 시도해주세요.");
    //   }
    // }, 1000);
  };

  return (
    <div className="w-full h-full">
      <Modal />
      <div className="md:w-8/12 flex flex-col justify-center items-center mt-5 h-full">
        {!data ? (
          <NonLoggedIn />
        ) : (
          <>
            <div className="min-w-[343px] min-h-[60px] flex flex-col justify-between ">
              <h1 className="w-full text-[22px] text-gray-900 font-bold leading-7">{data?.nickname} 님,</h1>
              <h3 className="text-lg text-gray-700 font-bold leading-7">당신의 하루를 늘 응원해요!</h3>
            </div>
            <div className="h-[180px] flex justify-center items-end">
              <TodoProgressBar user_id={data?.user_id} />
            </div>
            <div
              style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.16)" }}
              className="w-full min-h-[480px] max-w-[390px] mt-5 pt-5 px-4 rounded-t-[48px] bg-system-white h-full"
            >
              <h1 className="w-[343px] h-7 flex items-center pl-3 text-gray-900 font-extrabold text-base ">설정</h1>
              <ul>
                {!data?.isOAuth && (
                  <li
                    className={`relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px] border-gray-100 `}
                  >
                    <EmailSmall />
                    <p className="flex items-center h-[28px] ml-1 text-gray-800 font-medium text-base">이메일 계정</p>
                    <p className="absolute right-2 text-gray-300 font-medium text-base">{data?.email}</p>
                  </li>
                )}
                <Link href="/my-page/account/nickname">
                  <li className="relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                    <NicknameSmall />
                    <p className="flex items-center h-[28px] ml-1 text-gray-800 font-medium text-base">닉네임 변경</p>
                    <div className="absolute right-2">
                      <NextBtn />
                    </div>
                  </li>
                </Link>
                {!data?.isOAuth && (
                  <Link href="/my-page/account/password">
                    <li className="relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                      <PasswordSmall />
                      <p className="flex items-center h-[28px] ml-1 text-gray-800 font-medium text-base">
                        비밀번호 변경
                      </p>
                      <div className="absolute right-2">
                        <NextBtn />
                      </div>
                    </li>
                  </Link>
                )}
                <li
                  onClick={handleLogoutBtn}
                  className="relative min-w-[343px] h-16 mt-5 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 text-gray-800 font-medium text-base hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                >
                  <p className="text-gray-800 font-medium text-base">로그아웃</p>
                  <div className="absolute right-2">
                    <NextBtn />
                  </div>
                </li>
                <Link href="/my-page/account/delete-account">
                  <li className="relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 text-gray-800 font-medium text-base hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                    <p className="text-gray-800 font-medium text-base">회원탈퇴</p>
                    <div className="absolute right-2">
                      <NextBtn />
                    </div>
                  </li>
                </Link>
              </ul>
            </div>
          </>
        )}
        {/* {isLoggedout && (
          <>
            <h1 className="text-pai-400 font-extrabold text-xl leading-7 mt-32">로그아웃 되었습니다.</h1>
            <p className="mt-[14px] text-gray-600 font-medium text-sm leading-7">
              계속 이용하시려면 다시 로그인해주세요.
            </p>
            <div className="mt-48" onClick={() => router.replace("/login")}>
              <SubmitBtn text="로그인 하러가기" type={"button"} />
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default MyInfo;
