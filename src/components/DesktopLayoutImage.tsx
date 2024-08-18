"use client";
import usePageCheck from "@/hooks/usePageCheck";
import useSideNavStore from "@/store/useSideNavStore";
import Image from "next/image";

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

  return <Image src={imageSrc} alt="데스크탑 레이아웃 이미지" width={348} height={664} priority />;
};

export default DesktopLayoutImage;
