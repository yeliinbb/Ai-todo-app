// components/DiaryEditDetail.tsx
import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { TodoListType } from "@/types/diary.type";

interface DiaryEditDetailProps {
  pageData: {
    diary: any;
    itemIndex: string;
    todosArray: any[];
  };
}

const DiaryEditDetail: React.FC<DiaryEditDetailProps> = ({ pageData }) => {
  const { diary, itemIndex, todosArray } = pageData;
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
      <p>{diary.content[Number(itemIndex)]?.title}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(diary.content[Number(itemIndex)]?.content || "")
        }}
      />
      <div>
        <button>저장</button>
        <button>취소</button>
      </div>
    </div>
  );
};

export default DiaryEditDetail;
