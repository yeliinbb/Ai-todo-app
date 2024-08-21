"use client";
import revalidateAction from "@/actions/revalidataPath";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { saveDiaryEntry } from "@/lib/utils/diaries/saveDiaryEntry";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useUserData } from "@/hooks/useUserData";
import Todolist from "./Todolist";
import { TodoListType } from "@/types/diary.type";
import { updateIsFetchingTodo } from "@/lib/utils/todos/updateIsFetchingTodo";
import { fetchTodoItems } from "@/lib/utils/todos/fetchTodoData";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { useDiaryStore } from "@/store/useDiary.store";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import formats from "@/lib/utils/diaries/diaryEditorFormats";
import modules from "@/lib/utils/diaries/diaryEditorModules";
import FetchTodosIcon from "@/components/icons/diaries/FetchTodosIcon";
import CustomToolbar from "./CustomToolbar";
import { toast } from "react-toastify";
import DiaryWriteHeader from "./DiaryWriteHeader";
import SaveDiaryLoading from "./SaveDiaryLoading";
import dynamic from "next/dynamic";
import ReactQuillWithRef from "./DiaryQuill";
import ReactQuill from "react-quill";
import { useThrottle } from "@/hooks/useThrottle";
import { useDiary } from "./DiaryProvider";
import { useMediaQuery } from "react-responsive";

dayjs.locale("ko");

const MAX_TITLE_LENGTH = 30;
const MAX_CONTENT_LENGTH = 1000;
const customModules = {
  toolbar: {
    container: "#toolbar"
  }
};

interface DiaryTextEditorProps {
  diaryTitle?: string;
  diaryContent?: string;
  diaryId?: string;
  isFetching_todo?: boolean;
}

const DiaryTextEditor: React.FC<DiaryTextEditorProps> = ({
  diaryId = "",
  diaryContent = "",
  diaryTitle = "",
  isFetching_todo
}) => {
  const { selectedDate } = useselectedCalendarStore();
  const quillRef = useRef<ReactQuill>(null);
  const router = useRouter();
  const diaryTitleRef = useRef<HTMLInputElement>(null);
  const { data: loggedInUser } = useUserData();
  const userId = loggedInUser?.user_id;
  const formatSelectedDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일");
  };
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [saveDiaryLoading, setSaveDiaryLoading] = useState<boolean>(false);

  const [title, setTitle] = useState(diaryTitle);
  const [content, setContent] = useState(diaryContent);

  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });

  // const { title, setTitle, content, setContent } = useDiary();

  useEffect(() => {
    const addBorderRadiusToImages = (htmlContent: string) => {
      const parser = new DOMParser();

      const doc = parser.parseFromString(htmlContent, "text/html");

      const images = doc.querySelectorAll("img");

      //모든 이미지 태그를 찾아
      images.forEach((img) => {
        img.style.borderRadius = "20px";
        img.style.cursor = "pointer";
        img.style.border = "2px solid transparent";
      });

      return doc.body.innerHTML;
    };

    const updateContentWithBorderRadius = () => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const currentHTML = quill.root.innerHTML;
        const updatedHTML = addBorderRadiusToImages(currentHTML);
        quill.root.innerHTML = updatedHTML;
      }
    };

    updateContentWithBorderRadius();
  }, [diaryContent]);

  // const { title, content, todos, fetchingTodos, setTodos, setTitle, setContent, setFetchingTodos } = useDiaryStore();
  const queryClient= useQueryClient();
  const handleSave = async () => {
    if (quillRef.current && diaryTitleRef.current) {
      const quill = quillRef.current.getEditor();
      const htmlContent = quill.root.innerHTML;
      const diaryTitle = diaryTitleRef.current.value;
      if (!diaryTitle || !htmlContent || htmlContent === "<p><br></p>") {
        toast.warning("제목과 내용을 입력해주세요.");
        setSaveDiaryLoading(false);
        return;
      }
      if (!userId) {
        toast.error("로그인후 사용가능한 서비스입니다.");
        router.push("/login");
        setSaveDiaryLoading(false);
        return;
      }
      if (diaryId) {
        await updateIsFetchingTodo(userId, selectedDate, diaryId);
      }
      const navigateToPreview = async (toDetailData: any) => {
        router.push(`/diary/diary-detail/${toDetailData?.diaryData.diary_id}?itemIndex=${toDetailData?.itemIndex}`);
      };
      setSaveDiaryLoading(true);
      try {
        const toDetailData = await saveDiaryEntry(selectedDate, diaryTitle, htmlContent, diaryId, userId);
        queryClient.invalidateQueries({ queryKey: [[DIARY_TABLE, userId!, selectedDate]] });
        // queryClient.invalidateQueries({ queryKey:[DIARY_TABLE]  });
        await revalidateAction("/", "layout");
        await navigateToPreview(toDetailData);
      } catch (error) {
        console.error("Failed to save diary entry:", error);
        toast.error("일기 저장에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setSaveDiaryLoading(false);
      }
    }
    // setFetchingTodos(false);
  };
  const throttledSave = useThrottle();
  // const {
  //   data: fetchTodos,
  //   isPending: isFetchingTodos,
  //   error
  // } = useQuery<TodoListType[], Error, TodoListType[], [string, string, string]>({
  //   queryKey: ["diaryTodos", userId!, selectedDate],
  //   queryFn: fetchTodoItems
  //   // enabled: !!fetchingTodos
  // });
  // useEffect(() => {
  //   if (fetchTodos) {
  //     setTodos(fetchTodos);
  //   }
  // }, [fetchTodos, setTodos]);

  // const toggleFetchTodos = () => {
  //   setFetchingTodos(!fetchingTodos);
  // };

  const [closeButton, setCloseButton] = useState<HTMLSpanElement | null>(null);
  const handleImageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const imgElement = target as HTMLImageElement;

      // 부모 요소를 가져와서 style을 추가
      const parentElement = imgElement.parentElement;

      if (selectedImage === imgElement) {
        // 현재 선택된 이미지와 동일한 경우
        if (closeButton && parentElement) {
          parentElement.removeChild(closeButton); // closeBtn 제거
          imgElement.style.border = "2px solid transparent"; // 선택 해제
          imgElement.style.boxSizing = "content-box"; // 기본값으로 리셋
          parentElement.style.position = "";
          parentElement.style.display = "";
          setSelectedImage(null);
          setCloseButton(null);
        }
        return;
      }

      // 이전에 선택된 이미지가 있을 경우
      if (selectedImage && selectedImage !== imgElement) {
        const oldParentElement = selectedImage.parentElement;
        if (oldParentElement && closeButton) {
          oldParentElement.removeChild(closeButton); // 이전 closeBtn 제거
        }
        // 이전 이미지의 스타일 제거
        selectedImage.style.border = "2px solid transparent";
        selectedImage.style.boxSizing = "content-box"; // 기본값으로 리셋
      }

      if (parentElement) {
        parentElement.style.position = "relative";
        parentElement.style.display = "inline-block";
        parentElement.style.alignItems = "center";
        imgElement.style.border = "2px solid #FF9524";
        imgElement.style.boxSizing = "border-box";
        imgElement.style.borderRadius = "20px";
        imgElement.style.display = "block";

        const closeBtn = document.createElement("span");
        closeBtn.style.background = "#dfdfdf";
        closeBtn.style.width = "32px";
        closeBtn.style.height = "32px";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = `${isDesktop ? "25px" : "5px"}`;
        closeBtn.style.right = `10px`;
        closeBtn.style.cursor = "pointer";
        closeBtn.style.marginTop = "10px";
        closeBtn.style.display = "flex";
        closeBtn.style.alignItems = "center";
        closeBtn.style.justifyContent = "center";
        closeBtn.style.borderRadius = "50%";
        closeBtn.style.fontSize = "16px";
        closeBtn.style.fontWeight = "bold";
        closeBtn.style.color = "#262627";
        closeBtn.style.userSelect = "none"; // 텍스트 선택 방지
        closeBtn.setAttribute("tabindex", "-1"); // 포커스 방지
        closeBtn.style.caretColor = "transparent"; // 타이핑 커서 방지
        closeBtn.style.outline = "none"; // 포커스 시 외곽선 제거
        closeBtn.setAttribute("contentEditable", "false");

        closeBtn.innerHTML = `X`;
        closeBtn.addEventListener("click", () => {
          if (parentElement && imgElement) {
            parentElement.removeChild(imgElement); // 부모 요소에서 이미지를 삭제
          }
          if (closeBtn.parentElement) {
            closeBtn.parentElement.removeChild(closeBtn); // 부모 요소에서 closeBtn을 삭제
          }
          if (parentElement) {
            //부모요소의 스타일로 리셋(삭제안하면 엔터로 줄바꿈안됨)
            parentElement.style.position = "";
            parentElement.style.display = "";
          }
          setSelectedImage(null);
          setCloseButton(null);
        });

        parentElement.appendChild(closeBtn);
        setSelectedImage(imgElement);
        setCloseButton(closeBtn);
      }
    } else {
      if (selectedImage) {
        // 클릭된 이미지가 없을 때 선택 해제 처리
        selectedImage.style.border = "2px solid transparent";

        const oldParentElement = selectedImage.parentElement;
        if (oldParentElement && closeButton) {
          oldParentElement.removeChild(closeButton); // 선택된 이미지에서 closeBtn 제거
        }
        setSelectedImage(null);
        setCloseButton(null);
      }
    }
  };
  const countTextLength = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor(); // Quill 인스턴스 가져오기
      const text = quill.getText(); // 텍스트 추출
      const textLength = text.replace(/\s+/g, "").length; // 텍스트 길이 계산
      return textLength;
    }
  };
  const isComplete = title.trim() !== "" && content.trim() !== "" && !/^<p>\s*<\/p>$/.test(content.trim());

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const cookieData = getCookie("diary_state");

  //     if (cookieData) {
  //       // 투두리스트를 호출여부를 판단하는 로직
  //       const parsedData = JSON.parse(cookieData as string);
  //       const isFetching = isFetching_todo ? isFetching_todo : parsedData.fetchingTodos;
  //       setFetchingTodos(isFetching);
  //     }
  //     if (quillRef.current) {
  //       const quill = quillRef.current.getEditor();
  //       quill.on("text-change", handleEditorChange);
  //       const finalContent = diaryContent !== "" ? diaryContent : content;
  //       // console.log("diaryContent입니다.", diaryContent);
  //       // console.log("content입니다.", content);
  //       // console.log("finalContent입니다.", finalContent);
  //       setContent(finalContent);
  //       // quill.clipboard.dangerouslyPasteHTML(finalContent);
  //     }
  //     if (diaryTitleRef.current) {
  //       const finalTitle = title !== diaryTitle ? diaryTitle : title;
  //       setTitle(finalTitle);
  //       diaryTitleRef.current.value = finalTitle;
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, []);
  if (saveDiaryLoading) return <SaveDiaryLoading />;
  return (
    <div className="bg-gray-100">
      <DiaryWriteHeader headerText={formatSelectedDate(selectedDate)} />
      <div className="bg-system-white mt-5 desktop:h-[calc(100vh-4.125rem)] mobile:h-[calc(100dvh-4.125rem)] pt-[18px] box-border px-5 border-t-2 border-x-2 border-gray-100 rounded-t-[48px] desktop:border-4 desktop:border-gray-200 flex flex-col flex-1 justify-between ">
        <div className="quill-container flex flex-col w-full mx-auto relative desktop:h-[calc(100vh-11.375rem)] mobile:h-[calc(100vh-16.375rem)] flex-grow flex-shrink-0">
          {/* 완료버튼이 5rem+헤더가 3.875rem+각 마진 패딩이 40px이니 2.5rem = 11.375rem만큼 제외*/}
          <div
            className={`border-b border-gray-200 w-full mx-auto mt-4 flex flex-col relative ${isDesktop ? "py-5" : "py-3"}`}
          >
            <input
              value={title}
              ref={diaryTitleRef}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              id="title"
              type="text"
              className={`text-left font-bold h-7 outline-none w-full ${isDesktop ? "placeholder:text-sh1 text-sh1" : "text-sh4 placeholder:text-sh4"}`}
              placeholder="제목을 입력해주세요"
              maxLength={MAX_TITLE_LENGTH}
            />
            <p className="mobile:text-bc7 desktop:text-sh5 text-gray-600 h-5 absolute right-0 -bottom-[20px]">
              ({title.trim().length}/{MAX_TITLE_LENGTH})
            </p>
          </div>

          {/* Quill 에디터 부분 */}
          {/* <button
            onClick={toggleFetchTodos}
            className={`flex justify-start items-center gap-1 font-medium transition-all box-border h-7 text-gray-500`}
          >
            <FetchTodosIcon />
            <p className="h-7 font-bold text-base leading-7">
              {fetchingTodos ? "투두리스트 취소 하기" : "투두 리스트를 불러올까요?"}
            </p>
          </button> */}

          <CustomToolbar quillRef={quillRef} />

          {/* onClick={(e) => handleImageClick(e)} */}
          {/* onKeyDownCapture={(e) => {
              if (e.code === "Enter") {
                e.stopPropagation();
              }
            }} */}
          <div
            className="flex-1 overflow-hidden flex flex-col mt-9 relative font-sans"
            onClick={(e) => handleImageClick(e)}
          >
            {/* {fetchingTodos ? <Todolist todos={todos} /> : null} */}
            {/* {fetchTodos&& <Todolist todos={fetchTodos} />} */}
            <ReactQuillWithRef
              placeholder="오늘 하루를 기록해보세요"
              modules={customModules}
              theme="snow"
              formats={formats}
              className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth w-full"
              onChange={(value) => {
                setContent(value);
              }}
              ref={quillRef}
              value={content}
            />
            <p className="sticky bottom-[2.8rem] right-5 mobile:text-bc7 desktop:text-sh5 text-gray-600 text-right h-7">
              ({countTextLength() || 0}/{MAX_CONTENT_LENGTH})
            </p>
          </div>

          {/* 완료 버튼 부분 */}
        </div>
        <div className="h-20 flex items-center flex-grow flex-shrink-0">
          <button
            className={`w-[calc(100%-32px)] h-10 gap-4 mx-auto block rounded-full text-center text-system-white font-bold text-sm leading-7 ${isComplete ? "bg-fai-500" : "bg-gray-200"}`}
            onClick={() => throttledSave(handleSave, 3000)}
            disabled={!isComplete || saveDiaryLoading}
          >
            {saveDiaryLoading ? "저장 중..." : "완료"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryTextEditor;
