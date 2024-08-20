"use client";
import usePageCheck from "@/hooks/usePageCheck";
import useSideNavStore from "@/store/useSideNavStore";
import Image from "next/image";
import ChatNavigateBtnInImage from "./ChatNavigateBtnInImage";

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
  const aiType = isTodoPage ? "assistant" : "friend";

  return (
    <div className="relative">
      <Image src={imageSrc} alt="데스크탑 레이아웃 이미지" width={348} height={664} priority />
      {(isTodoPage || isDiaryPage) && (
        <div className="absolute bottom-14">
          <ChatNavigateBtnInImage aiType={aiType} />
        </div>
      )}
    </div>
  );
};

export default DesktopLayoutImage;
