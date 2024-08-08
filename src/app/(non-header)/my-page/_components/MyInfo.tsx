"use client";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TodoProgressBar from "./TodoProgressBar";
import { useThrottle } from "@/hooks/useThrottle";
import React, { Suspense } from "react";
import { toast } from "react-toastify";
import NothingTodo from "./NothingTodo";

const MyInfo = () => {
  const router = useRouter();
  const throttle = useThrottle();
  const { data, isPending, isError } = useUserData();
  if (isPending) return <p className="w-full h-screen flex justify-center items-center">Loading...</p>;
  if (isError) return <p className="w-full h-screen flex justify-center items-center">유저 데이터 조회 중 오류 발생</p>;

  const TodoProgressBar = React.lazy(() => import("./TodoProgressBar"));

  const handleLogoutBtn = () => {
    throttle(async () => {
      const response = await fetch("/api/myPage/logout");
      if (response.ok) {
        toast.success("로그아웃 되었습니다.");
        router.replace("/login");
      } else {
        toast.error("로그아웃을 다시 시도해주세요.");
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full">
      <div className="md:w-8/12 h-screen flex flex-col justify-center items-center pb-[130px]">
        <div className="min-w-[300px] min-h-[60px] flex flex-col justify-between -mt-10 ml-10 font-bold">
          <h1 className="w-full text-xl">{data?.nickname}님,</h1>
          <h3 className="text-base">당신의 하루를 늘 응원해요!</h3>
        </div>
        <div>
          <Suspense fallback={<NothingTodo />}>
            <TodoProgressBar user_id={data?.user_id} />
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
