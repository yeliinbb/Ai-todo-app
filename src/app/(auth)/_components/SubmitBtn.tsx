"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Propstype = {
  text: string;
  type: "button" | "submit";
  isDisabled?: boolean;
  isLoading?: boolean;
};

const SubmitBtn = ({ text, type, isDisabled, isLoading }: Propstype) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    if (buttonRef.current) {
      if (userAgent.includes("Mobile")) {
        buttonRef.current.addEventListener("touchstart", handleMouseDown);
        buttonRef.current.addEventListener("touchend", handleMouseUp);
      } else {
        buttonRef.current.addEventListener("mousedown", handleMouseDown);
        buttonRef.current.addEventListener("mouseup", handleMouseUp);
      }
    }
    // eslint-disable-next-line
  }, []);

  const backgroundColor = isDisabled
    ? "bg-gray-300"
    : text === "회원 탈퇴"
      ? isClicked
        ? "bg-system-red300"
        : "bg-system-red200"
      : isClicked || isLoading
        ? "bg-gradient-pai600-fai700-br"
        : "bg-gradient-pai400-fai500-br";

  //mt-[52px]

  return (
    <button
      type={type}
      ref={buttonRef}
      disabled={isDisabled}
      className={`desktop:text-lg desktop:w-full  desktop:border-none flex justify-center items-center min-w-[343px] min-h-[52px] mt-14 px-7 py-3 rounded-[28px] text-base font-extrabold text-system-white hover:border hover:border-paiTrans-60032 ${backgroundColor} ${
        isDisabled && "border-none"
      }`}
    >
      {isLoading ? <Image alt="로그인 중" src={"/LoadingSpinner.gif"} width={25} height={25} priority /> : text}
    </button>
  );
};

export default SubmitBtn;
