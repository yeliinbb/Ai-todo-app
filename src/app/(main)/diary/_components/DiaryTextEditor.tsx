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

dayjs.locale("ko");
const MAX_LENGTH = 1000;
const customModules = {
  // ...modules,
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
    return dayjs(date).format("YYYY년 M월 D일 dddd");
  };

  const handleContentChange = (content: string) => {
    // 내용이 변경될 때마다 실행되는 함수
    setContent(content);
  };

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
  return (
    <div className="bg-system-white mt-[20px] rounded-t-[48px] h-[calc(100vh-92px)] pt-[20px]">
      <div className="text-center h-[32px] flex items-center justify-center w-[calc(100%-32px)] mx-auto">
        <span className="text-gray-600 tracking-[0.8px] bg-gray-100">{formatSelectedDate(selectedDate)}</span>
      </div>
      <div className="quill-container h-[calc(100vh-225px)] flex flex-col bg-system-white w-[calc(100%-32px)] mx-auto relative">
        <div className=" bg-gray-100 border-b border-gray-300 flex items-center gap-4 mb-[16px]">
          <input
            value={title}
            ref={diaryTitleRef}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            type="text"
            className="flex-1 border-b border-gray-300 outline-none h-[52px]"
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
          <ReactQuill
            placeholder="오늘 하루를 기록해보세요(최대 1000자까지 입력가능합니다.)"
            modules={customModules}
            formats={formats}
            className="flex-1 overflow-y-auto w-full mt-4 h-[calc(100%-2.75rem)]"
            onChange={handleContentChange}
            ref={quillRef}
            value={content}
          />
        </div>

        {/* 완료 버튼 부분 */}
      </div>
      <div className="h-20 flex items-center">
        <button
          className={`w-[calc(100%-32px)] h-[44px] gap-4 mx-auto block rounded-full text-center text-system-white font-bold text-sm leading-7 ${isComplete ? "bg-fai-500" : "bg-gray-200"}`}
          onClick={handleSave}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default DiaryTextEditor;
