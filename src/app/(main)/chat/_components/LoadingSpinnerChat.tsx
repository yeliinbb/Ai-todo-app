"use client";
import Image from "next/image";
import { AIType } from "@/types/chat.session.type";

const LoadingSpinnerChat = ({ aiType }: { aiType: AIType }) => {
  const imageSrc = aiType === "friend" ? "/Loading.FAi.gif" : "/Loading.PAi.gif";
  const loadingText = `${aiType === "friend" ? "FAi" : "PAi"} 불러오는 중...`;

  return (
    <div className="flex flex-col items-center justify-center z-[10000] w-full">
      <Image
        alt="로딩 중"
        src={imageSrc}
        width={150}
        height={150}
        priority
        className="w-[9.375rem] h-[9.375rem] desktop:w-[12.5rem] desktop:h-[12.5rem]"
      />
      <span className="text-sh2 desktop:text-h1">{loadingText}</span>
    </div>
  );
};

export default LoadingSpinnerChat;
