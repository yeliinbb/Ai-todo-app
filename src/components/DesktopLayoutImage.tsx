"use client";
import usePageCheck from "@/hooks/usePageCheck";
import useSideNavStore from "@/store/useSideNavStore";
import Image from "next/image";
import Link from "next/link";
import ChevronRight from "./icons/chat/ChevronRight";

const DesktopLayoutImage = () => {
  const { isHomePage, isChatPage, isTodoPage, isDiaryPage, isPaiPage, isFaiPage } = usePageCheck();
  const { isSideNavOpen } = useSideNavStore();
  const getImageSrc = () => {
    if (isHomePage) return "/image.layout.home.png";
    if (isChatPage && isSideNavOpen) return "/image.layout.chat.search.png";
    if (isChatPage) return "/image.layout.chat.png";
    if (isTodoPage) return "/image.layout.todo.png";
    if (isDiaryPage) return "/image.layout.diary.png";
    if (isPaiPage) return "/image.layout.pai.png";
    if (isFaiPage) return "/image.layout.fai.png";
    return "/image.layout.default.png"; // 기본 이미지
  };

  const imageSrc = getImageSrc();

  return (
    <div className="relative">
      <Image src={imageSrc} alt="데스크탑 레이아웃 이미지" width={348} height={664} priority />
      {isTodoPage && (
        <Link href="/chat" className="absolute bottom-14">
          <button className="font-bold text-[18px] text-pai-400 pl-4 py-2 px-4 ml-1 flex items-center justify-center">
            <span>PAi와 채팅하기</span>
            <span className="ml-2">
              <ChevronRight width={24} height={24} fill="currentColor" />
            </span>
          </button>
        </Link>
      )}
      {isDiaryPage && (
        <Link href="/chat" className="absolute bottom-14">
          <button className="font-bold text-[18px] text-fai-500 pl-4 py-2 px-4 ml-1 flex items-center justify-center">
            <span>FAi와 채팅하기</span>
            <span className="ml-2">
              <ChevronRight width={24} height={24} fill="currentColor" />
            </span>
          </button>
        </Link>
      )}
    </div>
  );
};

export default DesktopLayoutImage;
