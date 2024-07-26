"use client";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";

const MyInfo = () => {
  const { data, isPending, isError } = useUserData();
  if (isPending) return <p>로딩중</p>;
  if (isError) return <p>유저 데이터 조회 중 오류 발생</p>;

  // TODO: 로그인 유저 닉네임 !== 변경한 닉네임 (auth-users 테이블을 업데이트 해야하는 건지?)

  return (
    <div className="w-full  flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[300px] min-h-[60px] flex flex-col justify-between mt-32 ml-10 font-bold">
          <h1 className="text-xl">{data?.user?.user_metadata.full_name || data?.user?.user_metadata.nickname}님,</h1>
          <h3 className="text-base">당신의 하루를 늘 응원해요!</h3>
        </div>
        <div className="flex justify-center items-center min-w-[343px] h-32 mt-10 bg-slate-200 rounded-[20px] ">
          Todo Progress Bar
        </div>
        <ul className="mt-16">
          <Link href="/my-page/account/nickname">
            <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200">
              닉네임 변경
            </li>
          </Link>
          <Link href="/my-page/account/password">
            <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200">
              비밀번호 변경
            </li>
          </Link>
          <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black hover:bg-slate-200 transition duration-200">
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
