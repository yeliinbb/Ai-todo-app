import React from "react";
import { TodoListType } from "@/types/diary.type";
import DiaryTextEditor from "./DiaryTextEditor";

interface DiaryEditDetailProps {
  pageData: {
    diary: { title: string; content: string; diary_id: string; isFetching_todo: boolean };
    todosArray: TodoListType[];
  };
}

const DiaryEditDetail: React.FC<DiaryEditDetailProps> = ({ pageData }) => {
  const { diary } = pageData;
  return (
    <>
      <DiaryTextEditor
        diaryTitle={diary.title}
        diaryContent={diary.content}
        diaryId={diary.diary_id}
        isFetching_todo={diary.isFetching_todo}
      />
    </>
  );
};

export default DiaryEditDetail;
