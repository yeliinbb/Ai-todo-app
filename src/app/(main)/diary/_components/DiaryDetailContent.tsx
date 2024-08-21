"use client";
import detailStyle from "@/app/(main)/diary/_components/DiaryDetailPage.module.css";
import { useEffect, useRef } from "react";

interface DiaryDetailContentPropsType {
  diaryContents: string;
}

const DiaryDetailContent: React.FC<DiaryDetailContentPropsType> = ({ diaryContents }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(diaryContents, "text/html");

      // 이미지에 border-radius 추가
      const images = doc.querySelectorAll("img");
      images.forEach((img) => {
        img.style.borderRadius = "20px";
        img.style.border = "0px";
        img.style.cursor = "none";

        const parent = img.parentElement;
        if (parent) {  
          const spansInSameParent = parent.querySelectorAll("span");
          spansInSameParent.forEach((span) => span.remove());
        }
      });

      // 처리된 HTML을 container에 삽입
      containerRef.current.innerHTML = doc.body.innerHTML;
    }
  }, [diaryContents]);
  return (
    <div ref={containerRef} className={`w-[calc(100%-32px)] mx-auto mt-4 font-sans ${detailStyle.listContainer}`} />
  );
};
export default DiaryDetailContent;
