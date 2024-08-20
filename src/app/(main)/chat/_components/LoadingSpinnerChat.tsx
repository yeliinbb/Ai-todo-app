"use client";
import Image from "next/image";
import { AIType } from "@/types/chat.session.type";

const LoadingSpinnerChat = ({ aiType }: { aiType: AIType }) => {
  const isFai = aiType === "friend";
  const imageSrc = isFai ? "/Loading.FAi.gif" : "/Loading.PAi.gif";
  const loadingText = `${isFai ? "FAi" : "PAi"} 불러오는 중...`;

  return (
    <div className="flex flex-col items-center justify-center z-[10000] w-full">
      <div className="w-20 h-20 desktop:w-[15.625rem] desktop:h-[15.625rem]">
        <Image alt="로딩 중" src={imageSrc} width={250} height={250} priority />
      </div>
      <span className={`${isFai ? "text-fai-500" : "text-pai-400"} text-h5 desktop:text-h1 desktop:mb-7`}>
        {loadingText}
      </span>
    </div>
  );
};

export default LoadingSpinnerChat;
