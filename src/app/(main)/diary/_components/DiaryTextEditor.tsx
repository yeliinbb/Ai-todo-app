"use client";
import revalidateAction from "@/actions/revalidataPath";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { saveDiaryEntry } from "@/lib/utils/diaries/saveDiaryEntry";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
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

dayjs.locale("ko");

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

  const userId = loggedInUser?.email;

  const formatSelectedDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일 dddd");
  };

  const { title, content, todos, fetchingTodos, setTodos, setTitle, setContent, setFetchingTodos } = useDiaryStore();

  const handleSave = async () => {
    if (quillRef.current && diaryTitleRef.current) {
      const quill = quillRef.current.getEditor();
      const htmlContent = quill.root.innerHTML;
      const diaryTitle = diaryTitleRef.current.value;
      if (!diaryTitle || !htmlContent || htmlContent === "<p><br></p>") {
        alert("제목과 내용을 입력해주세요.");
        return;
      }
      if (!userId) {
        alert("로그인하지않았습니다.");
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
        alert("일기 저장에 실패했습니다. 다시 시도해 주세요.");
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
  const isComplete = title && content && content !== "<p><br></p>";
  return (
    <div className="bg-system-white mt-[20px] rounded-t-[48px] h-[calc(100vh-92px)] pt-[20px]">
      <div className="text-center h-[32px] flex items-center justify-center w-[calc(100%-32px)] mx-auto">
        <span className="text-gray-600 tracking-[0.8px]">{formatSelectedDate(selectedDate)}</span>
      </div>
      <div className="quill-container h-[calc(100vh-218px)] flex flex-col bg-system-white w-[calc(100%-32px)] mx-auto">
        <div className=" bg-gray-100 border-b border-gray-300 flex items-center gap-4 mb-[16px]">
          <input
            value={title}
            ref={diaryTitleRef}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            type="text"
            className="flex-1 border-b border-gray-300 outline-none h-[52px]"
            placeholder="제목 입력"
          />
        </div>

        {/* Quill 에디터 부분 */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {fetchingTodos ? <Todolist todos={todos} /> : null}
          <ReactQuill
            placeholder="오늘 하루를 기록해보세요"
            modules={modules}
            formats={formats}
            className="flex-1 overflow-y-auto w-full mt-4"
            onChange={(content) => setContent(content)}
            ref={quillRef}
            value={content}
          />
          <button
            onClick={toggleFetchTodos}
            className="absolute bottom-20 bg-fai-400 text-system-white right-2 mt-2 ml-2 bg-blue-500 text-white px-4 py-2 rounded-full flex justify-center items-center gap-1"
          >
            <FetchTodosIcon/>
            {fetchingTodos ? "투두리스트 취소 하기" : "투두 리스트 불러오기+"}
          </button>
        </div>

        {/* 완료 버튼 부분 */}
      </div>
      <button
        className={`w-[calc(100%-32px)] h-[44px] gap-4 mx-auto block rounded-full text-center text-system-white font-bold text-sm leading-7 mt-[20px] ${isComplete ? "bg-fai-500" : "bg-gray-200"}`}
        onClick={handleSave}
      >
        완료
      </button>
    </div>
  );
};

export default DiaryTextEditor;
