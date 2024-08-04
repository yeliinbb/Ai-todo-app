"use client";
import revalidateAction from "@/actions/revalidataPath";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { saveDiaryEntry } from "@/lib/utils/diaries/saveDiaryEntry";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useUserData } from "@/hooks/useUserData";
import Todolist from "./Todolist";
import { TodoListType } from "@/types/diary.type";
import { updateIsFetchingTodo } from "@/lib/utils/todos/updateIsFetchingTodo";
import { fetchTodoItems } from "@/lib/utils/todos/fetchTodoData";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import formats from "@/lib/utils/diaries/diaryMapFormats";
import modules from "@/lib/utils/diaries/diaryMapModules";
import { useDiaryStore } from "@/store/useDiary.store";

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
    queryFn: fetchTodoItems
    // enabled: fetchingTodos
  });

  useEffect(() => {
    if (fetchTodos) {
      setTodos(fetchTodos);
    }
  }, [fetchTodos, setTodos]);

  const handleCancel = () => {
    router.back();
  };

  const handleFetchTodos = async (userId: string, selectedDate: string) => {
    setFetchingTodos(true);
    if (diaryTitleRef.current) {
      setTitle(diaryTitleRef.current.value);
    }
    setContent(content);
    console.log(fetchTodos)
    setTodos(fetchTodos || []);
  };

  useEffect(() => {
    setFetchingTodos(isFetching_todo!);
    if (typeof window !== "undefined") {
      console.log(isFetching_todo);
      console.log(fetchingTodos);
      console.log(diaryContent);

      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        console.log(content);
        const finalContent = content !== diaryContent ? content : diaryContent;
        setContent(finalContent);
        quill.clipboard.dangerouslyPasteHTML(finalContent);
      }
      if (diaryTitleRef.current) {
        console.log(title);
        console.log(diaryTitle);
        const finalTitle = title !== diaryTitle ? title : diaryTitle;
        setTitle(finalTitle);
        diaryTitleRef.current.value = finalTitle;
      }
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="quill-container h-screen flex flex-col w-[50%] mx-auto">
      <div className="h-[80px] p-4 bg-gray-100 border-b border-gray-300 flex items-center gap-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          value={title}
          ref={diaryTitleRef}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="제목을 입력하세요"
        />
      </div>

      {/* Quill 에디터 부분 */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {fetchingTodos ? (
          <Todolist todos={todos} />
        ) : (
          <div className="border-r border-l border-slate-300">
            <p className="text-center bg-system-white">투두리스트를 가져와 일기를 작성해보세요</p>
          </div>
        )}
        <ReactQuill
          placeholder="일기내용을 추가해보세요"
          modules={modules}
          formats={formats}
          className="flex-1 overflow-y-auto"
          onChange={(content) => setContent(content)}
          ref={quillRef}
          value={content}
        />
        <button
          onClick={() => {
            handleFetchTodos(userId!, selectedDate);
          }}
          className="absolute bottom-12 right-2 mt-2 ml-2 bg-blue-500 text-white px-2 py-1 rounded"
        >
          투두 리스트 불러오기+
        </button>
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
