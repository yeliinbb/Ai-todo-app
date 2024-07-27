"use client";

import revalidateAction from "@/actions/revalidataPath";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { saveDiaryEntry } from "@/utils/saveDiaryEntry";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import ReactQuill from "react-quill";
// const ReactQuillComponent = dynamic(() => import("react-quill"), { ssr: false });

interface DiaryTextEditorProps {
  diaryTitle?: string;
  diaryContent?: string;
  diaryId?: string;
}

const DiaryTextEditor: React.FC<DiaryTextEditorProps> = ({ diaryTitle = "", diaryContent = "", diaryId = "" }) => {
  const { selectedDate } = useselectedCalendarStore();
  const quillRef = useRef<ReactQuill>(null);
  const router = useRouter();
  const diaryTitleRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }, { font: [] }],
        [{ list: "check" }],
        ["bold", "italic", "underline"],
        ["strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image"],
        ["blockquote"],
        [{ "code-block": true }],
        ["location"]
      ]
    }

    // 단축키 기능 추가 여부 확인필요
  };

  const formats = [
    "header", // 헤더 스타일
    "font", // 폰트 스타일
    "list", // 목록 스타일 (ordered, bullet, check)
    "check", // 체크리스트
    "bold", // 굵게
    "italic", // 기울임
    "underline", // 밑줄
    "strike", // 취소선
    "color", // 글자 색상
    "background", // 배경 색상
    "align", // 정렬 (left, center, right)
    "link", // 링크
    "image", // 이미지
    "blockquote", // 블록 인용
    "code-block", // 코드 블록
    "indent", // 들여쓰기
    "script", // 스크립트 (sub, super)
    "indent", // 들여쓰기 (both +1 and -1)
    "location" //위치 추가 버튼
  ];

  const handleSave = async () => {
    if (quillRef.current && diaryTitleRef.current) {
      const quill = quillRef.current.getEditor();
      const htmlContent = quill.root.innerHTML;
      const diaryTitle = diaryTitleRef.current.value;
      if (!diaryTitle || !htmlContent || htmlContent === "<p><br></p>") {
        alert("제목과 내용을 입력해주세요.");
        return;
      }

      await saveDiaryEntry(selectedDate, diaryTitle, htmlContent, diaryId);
      queryClient.invalidateQueries({ queryKey: ["diaries", selectedDate] });
      await revalidateAction("/", "layout");
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        quill.clipboard.dangerouslyPasteHTML(diaryContent);
      }
      if (diaryTitleRef.current) {
        diaryTitleRef.current.value = diaryTitle;
      }
    }
  }, [diaryTitle, diaryContent]);

  // useEffect(() => {
  //   if (quillRef.current) {
  //     const quill = quillRef.current.getEditor();
  //     const toolbar = quill.getModule("toolbar");

  //     if (toolbar) {
  //       const customButtonElement = document.querySelector(".ql-location");
  //       if (customButtonElement) {
  //         customButtonElement.innerHTML = "📍";
  //         customButtonElement.className =
  //           "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-150 ease-in-out w-[]";
  //       }
  //     }
  //   }
  // }, []);

  return (
    <div className="quill-container h-screen flex flex-col w-[50%] mx-auto">
      {/* 제목 입력 부분 */}
      <div className="h-[80px] p-4 bg-gray-100 border-b border-gray-300 flex items-center gap-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          ref={diaryTitleRef}
          id="title"
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="제목을 입력하세요"
        />
      </div>

      {/* Quill 에디터 부분 */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ReactQuill
          placeholder="일기내용을 추가해보세요"
          modules={modules}
          formats={formats}
          className="flex-1 overflow-y-auto"
          ref={quillRef}
        />
      </div>

      {/* 완료 버튼 부분 */}
      <div className="p-4 bg-gray-100 border-t border-gray-300 flex justify-end">
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          onClick={handleSave}
        >
          완료
        </button>
        <button
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default DiaryTextEditor;
