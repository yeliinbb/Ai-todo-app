"use client";

import { useEffect, useRef, useState } from "react";

type Propstype = {
  text: string;
  type: "button" | "submit";
  isDisabled?: boolean;
};

const SubmitBtn = ({ text, type, isDisabled }: Propstype) => {
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

  return (
    <button
      type={type}
      ref={buttonRef}
      disabled={isDisabled}
      className={`${text === "재발송" ? "min-w-[303px] min-h-[44px]" : "min-w-[343px] min-h-[52px]"} mt-[52px] px-7 py-3 rounded-[28px] text-base font-extrabold text-system-white hover:border hover:border-paiTrans-60032 ${isDisabled ? "bg-gray-300 border-none" : "bg-gradient-pai400-fai500-br"} ${isClicked && "bg-gradient-pai600-fai700-br"}`}
    >
      {text}
    </button>
  );
};

export default SubmitBtn;
