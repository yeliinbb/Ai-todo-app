"use client";

import RoundNextBtn from "@/components/icons/myPage/RoundNextBtn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NonLoggedIn = () => {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
  };

  // 모바일 : 온터치스타트/엔드
  // 웹 : 온마우스다운/업

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (divRef.current) {
      if (userAgent.includes("Mobile")) {
        divRef.current.addEventListener("touchstart", handleMouseDown);
        divRef.current.addEventListener("touchend", handleMouseUp);
      } else {
        divRef.current.addEventListener("mousedown", handleMouseDown);
        divRef.current.addEventListener("mouseup", handleMouseUp);
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-[calc(100vh-105px)]">
      <div className="min-w-[343px] min-h-[60px] flex flex-col justify-between">
        <h1 className="w-full text-[22px] text-gray-900 font-bold leading-7">로그인 후,</h1>
        <h1 className="w-full text-[22px] text-gray-900 font-bold leading-7">서비스 이용이 가능합니다</h1>
      </div>
      <div
        ref={divRef}
        className={`flex flex-col justify-center relative px-5 py-4 min-w-[347px] min-h-[76px] mt-7 bg-system-white border-2 border-pai-200 rounded-[32px] hover:cursor-pointer duration-200 hover:border-pai-400 ${isClicked && "border-pai-200 bg-pai-400 text-system-white"}`}
      >
        <Link href={"/login"}>
          <h1 className="text-pai-400 font-extrabold text-lg leading-7">로그인 하러가기</h1>
          <div className="absolute right-5 top-5 -translate-y-0.5">
            <RoundNextBtn />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NonLoggedIn;
