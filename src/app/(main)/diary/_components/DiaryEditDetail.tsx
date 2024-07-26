import React from "react";
import { TodoListType } from "@/types/diary.type";
import DiaryTextEditor from "./DiaryTextEditor";

interface DiaryEditDetailProps {
  pageData: {
    diary: { title: string; content: string; diary_id: string };
    todosArray: TodoListType[];
  };
}

const DiaryEditDetail: React.FC<DiaryEditDetailProps> = ({ pageData }) => {
  const { diary, todosArray } = pageData;

  return (
    <div>
      <h1>수정하는 페이지입니다.</h1>
      {/* <p>날짜: {diary.created_at.split('T')[0]}</p> */}
      <p>여기가 투두리스트입니다.</p>
      {todosArray.length > 0 && (
        <div>
          <h3>To-Do List</h3>
          <ul>
            {todosArray.map((todo: TodoListType) => (
              <li key={todo.todo_id}>{todo.todo_title}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4">여기서 부터 다이얼 내용입니다.</p>
      <DiaryTextEditor diaryTitle={diary.title} diaryContent={diary.content} diaryId={diary.diary_id} />
    </div>
  );
};

export default DiaryEditDetail;
