"use client";
import usePageCheck from "@/hooks/usePageCheck";
import useSideNavStore from "@/store/useSideNavStore";
import Image from "next/image";
import ChatNavigateBtnInImage from "./ChatNavigateBtnInImage";

const DesktopLayoutImage = () => {
  const { isHomePage, isChatPage, isTodoPage, isDiaryPage, isPaiPage, isFaiPage } = usePageCheck();
  const { isSideNavOpen } = useSideNavStore();
  const getImageSrc = () => {
    if (isHomePage) return "/desktop-layout/image.layout.home.svg";
    if (isChatPage && isSideNavOpen) return "/desktop-layout/image.layout.chat.search.svg";
    if (isChatPage) return "/desktop-layout/image.layout.chat.svg";
    if (isTodoPage) return "/desktop-layout/image.layout.todo.svg";
    if (isDiaryPage) return "/desktop-layout/image.layout.diary.svg";
    if (isPaiPage) return "/desktop-layout/image.layout.pai.svg";
    if (isFaiPage) return "/desktop-layout/image.layout.fai.svg";
    return "/desktop-layout/image.layout.default.svg"; // 기본 이미지
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
