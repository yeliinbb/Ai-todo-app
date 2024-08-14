"use client";
import revalidateAction from "@/actions/revalidataPath";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { saveDiaryEntry } from "@/lib/utils/diaries/saveDiaryEntry";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
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
import { list } from "postcss";
import { toast } from "react-toastify";
import DiaryWriteHeader from "./DiaryWriteHeader";
import Quill from "quill";
import CloseBtn from "@/components/icons/modal/CloseBtn";
import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
dayjs.locale("ko");

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

const MAX_LENGTH = 1000;
const customModules = {
  ...modules,
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
  const queryClient = useQueryClient();
  const { data: loggedInUser } = useUserData();
  const userId = loggedInUser?.user_id;
  const formatSelectedDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일");
  };
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imagePosition, setImagePosition] = useState<{ top: number; left: number } | null>(null);


  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const handleImageClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.tagName === "IMG") {
          const imgElement = target as HTMLImageElement;
          if (selectedImage === imgElement) {
            setSelectedImage(null);
            setImagePosition(null);
          } else {
            setSelectedImage(imgElement);
            updateImagePosition(imgElement);
          }
        } else {
          setSelectedImage(null);
          setImagePosition(null);
        }
      };

      quill.root.addEventListener("click", handleImageClick);

      return () => {
        quill.root.removeEventListener("click", handleImageClick);
      };
    }
  }, [selectedImage]);

  useEffect(() => {
    const editorElement = quillRef.current?.getEditor().root;

    const handleScroll = () => {
      if (selectedImage) {
        updateImagePosition(selectedImage);
      }
    };

    if (editorElement) {
      editorElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectedImage]);

  const handleImageClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.tagName === "IMG") {
      const imgElement = target as HTMLImageElement;
      if (selectedImage === imgElement) {
        setSelectedImage(null);
        setImagePosition(null);
      } else {
        setSelectedImage(imgElement);
        updateImagePosition(imgElement);
      }
    } else {
      setSelectedImage(null);
      setImagePosition(null);
    }
  };

  //빈공간 클릭하면 선택 해제
  // const handleDocumentClick = (e: MouseEvent) => {
  //   if (selectedImage && !e.composedPath().includes(selectedImage)) {
  //     setSelectedImage(null);
  //     setImagePosition(null);
  //   }
  // };

  const updateImagePosition = (imgElement: HTMLImageElement) => {
    const editorElement = quillRef.current?.getEditor().root;

    if (!editorElement) return;
    const imgRect = imgElement.getBoundingClientRect();
    const editorRect = editorElement.getBoundingClientRect();

    // 이미지의 위치를 .ql-editor의 스크롤과 맞추어 조정
    setImagePosition({
      top: imgRect.top - editorRect.top + editorElement.scrollTop,
      left: imgRect.left - editorRect.left + editorElement.scrollLeft
    });
  };

  const handleContentChange = (content: string) => {
    setContent(content);
    // 편집기 내용이 변경될 때마다 이미지 위치 업데이트
    if (selectedImage) {
      updateImagePosition(selectedImage);
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const blot = Quill.find(selectedImage); // Quill.find를 사용해 이미지에 해당하는 blot을 찾음
      if (blot) {
        const index = quill.getIndex(blot); // blot의 인덱스를 가져옴
        quill.deleteText(index, 1); // 에디터에서 이미지를 제거
        setSelectedImage(null); // 상태 초기화
        setImagePosition(null);
      }
    }
  };

  // const handleContentChange = (content: string) => {
  //   // 내용이 변경될 때마다 실행되는 함수
  //   setContent(content);
  // };

  const handleEditorChange = (editor: any) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const length = quill.getLength() - 1;

      if (length > MAX_LENGTH) {
        const text = quill.getText();
        const trimmedText = text.slice(0, MAX_LENGTH);
        quill.setText(trimmedText);
        quill.setSelection(MAX_LENGTH, 0);
        toast.warning(`입력가능한 최대 글자수까지 입력하셨습니다. (내용:1000자/제목:15자)`);
      }
    }
  };

  const { title, content, todos, fetchingTodos, setTodos, setTitle, setContent, setFetchingTodos } = useDiaryStore();

  const handleSave = async () => {
    if (quillRef.current && diaryTitleRef.current) {
      const quill = quillRef.current.getEditor();
      const htmlContent = quill.root.innerHTML;
      const diaryTitle = diaryTitleRef.current.value;
      if (!diaryTitle || !htmlContent || htmlContent === "<p><br></p>") {
        toast.success("제목과 내용을 입력해주세요.");
        return;
      }
      if (!userId) {
        toast.success("로그인후 사용가능한 서비스입니다.");
        router.push("/login");
        return;
      }
      if (diaryId) {
        await updateIsFetchingTodo(userId, selectedDate, diaryId);
      }
      try {
        const toDetailData = await saveDiaryEntry(
          selectedDate,
          diaryTitle,
          htmlContent,
          diaryId,
          fetchingTodos,
          userId
        );
        queryClient.invalidateQueries({ queryKey: [DIARY_TABLE, userId!, selectedDate] });
        await revalidateAction("/", "layout");
        router.push(`/diary/diary-detail/${toDetailData?.diaryData.diary_id}?itemIndex=${toDetailData?.itemIndex}`);
      } catch (error) {
        console.error("Failed to save diary entry:", error);
        toast.error("일기 저장에 실패했습니다. 다시 시도해 주세요.");
      }
    }
    setFetchingTodos(false);
  };
  const {
    data: fetchTodos,
    isPending: isFetchingTodos,
    error
  } = useQuery<TodoListType[], Error, TodoListType[], [string, string, string]>({
    queryKey: ["diaryTodos", userId!, selectedDate],
    queryFn: fetchTodoItems,
    enabled: !!fetchingTodos
  });
  useEffect(() => {
    if (fetchTodos) {
      setTodos(fetchTodos);
    }
  }, [fetchTodos, setTodos]);

  const toggleFetchTodos = () => {
    setFetchingTodos(!fetchingTodos);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookieData = getCookie("diary_state");

      if (cookieData) {
        const parsedData = JSON.parse(cookieData as string);
        const isFetching = isFetching_todo ? isFetching_todo : parsedData.fetchingTodos;
        setFetchingTodos(isFetching);
      }
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        quill.on("text-change", handleEditorChange);
        const finalContent = content !== diaryContent ? diaryContent : content;
        setContent(finalContent);
        quill.clipboard.dangerouslyPasteHTML(finalContent);
      }
      if (diaryTitleRef.current) {
        const finalTitle = title !== diaryTitle ? diaryTitle : title;
        setTitle(finalTitle);
        diaryTitleRef.current.value = finalTitle;
      }
    }
    // eslint-disable-next-line
  }, []);

  const isComplete = title.trim() !== "" && content.trim() !== "" && !/^<p>\s*<\/p>$/.test(content.trim());
  console.log("top위치", imagePosition?.top);
  console.log("left위치", imagePosition?.left);
  return (
    <>
      <DiaryWriteHeader headerText={formatSelectedDate(selectedDate)} />
      <div className="bg-system-white mt-[20px] rounded-t-[48px] h-[calc(100vh-92px)] pt-[18px] box-border">
        {/* <div className="text-center h-[32px] flex items-center justify-center w-[calc(100%-32px)] mx-auto">
        <span className="text-gray-600 tracking-[0.8px] bg-gray-100">{formatSelectedDate(selectedDate)}</span>
      </div> */}

        <div className="quill-container flex flex-col w-[calc(100%-40px)] mx-auto relative h-[calc(100vh-12rem)]">
          {/* 완료버튼이 5rem+헤더가 4.5rem+각 마진 패딩이 40px이니 2.5rem = 12rem만큼 제외*/}
          <div className="border-b border-gray-200 w-full h-[52px] mx-auto py-3 mt-4">
            <input
              value={title}
              ref={diaryTitleRef}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              type="text"
              className="text-left text-sh4 font-bold h-7 outline-none"
              placeholder="제목 입력(최대15자까지 입력가능합니다.)"
              maxLength={15}
            />
          </div>

          {/* Quill 에디터 부분 */}
          <button
            onClick={toggleFetchTodos}
            className={`flex justify-start items-center gap-1 font-medium transition-all box-border h-7 text-gray-500`}
          >
            <FetchTodosIcon />
            <p className="h-7 font-bold text-base leading-7">
              {fetchingTodos ? "투두리스트 취소 하기" : "투두 리스트를 불러올까요?"}
            </p>
          </button>

          <CustomToolbar quillRef={quillRef} />

          <div className="flex-1 overflow-hidden flex flex-col relative">
            {fetchingTodos ? <Todolist todos={todos} /> : null}
            {selectedImage && imagePosition && (
              <div
                style={{
                  position: "absolute", // 이미지의 상대 위치를 유지
                  top: imagePosition.top + 100,
                  left: imagePosition.left + 100,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10
                }}
              >
                <CloseBtn
                  btnStyle="cursor-pointer z-10 bg-gray-200 border border-gray-200 p-3 rounded-full text-gray-900"
                  onClick={handleRemoveImage}
                />
              </div>
            )}
            <ReactQuill
              placeholder="오늘 하루를 기록해보세요(최대 1000자까지 입력가능합니다.)"
              modules={customModules}
              formats={formats}
              className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth w-full mt-4 h-[calc(100%-3.375rem)]"
              onChange={handleContentChange}
              ref={quillRef}
              value={content}
            />
          </div>

          {/* 완료 버튼 부분 */}
        </div>
        <div className="h-20 flex items-center">
          <button
            className={`w-[calc(100%-32px)] h-10 gap-4 mx-auto block rounded-full text-center text-system-white font-bold text-sm leading-7 ${isComplete ? "bg-fai-500" : "bg-gray-200"}`}
            onClick={handleSave}
          >
            완료
          </button>
        </div>
      </div>
    </>
  );
};

export default DiaryTextEditor;
