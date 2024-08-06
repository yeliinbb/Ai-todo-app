"use client";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TodoProgressBar from "./TodoProgressBar";
import { useThrottle } from "@/hooks/useThrottle";
import React, { Suspense } from "react";

const MyInfo = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const { data, isPending, isError } = useUserData();
  if (isPending) return <p>로딩중</p>;
  if (isError) return <p>유저 데이터 조회 중 오류 발생</p>;

  const TodoProgressBar = React.lazy(() => import("./TodoProgressBar"));

  const handleLogoutBtn = () => {
    throttle(async () => {
      const response = await fetch("/api/myPage/logout");
      if (response.ok) {
        console.log("로그아웃 성공");
        router.replace("/login");
      } else {
        console.log("로그아웃 실패");
      }
    }, 1000);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="md:w-8/12 h-full">
        <div className="min-w-[300px] min-h-[60px] flex flex-col justify-between mt-16 ml-10 font-bold">
          <h1 className="text-xl">{data?.nickname}님,</h1>
          <h3 className="text-base">당신의 하루를 늘 응원해요!</h3>
        </div>
        <div className="flex justify-center items-center min-w-[343px] h-32 mt-10 bg-gray-200 rounded-[20px] ">
          <Suspense fallback={<div>Loading...</div>}>
            <TodoProgressBar email={data?.email} />
          </Suspense>
        </div>
        <ul className="mt-4">
          <Link href="/my-page/account/nickname">
            <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200">
              닉네임 변경
            </li>
          </Link>
          {!data?.isOAuth && (
            <Link href="/my-page/account/password">
              <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200">
                비밀번호 변경
              </li>
            </Link>
          )}

          <li
            onClick={handleLogoutBtn}
            className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200 hover:cursor-pointer"
          >
            로그아웃
          </li>
          <Link href="/my-page/account/delete-account">
            <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200">
              회원탈퇴
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default MyInfo;
