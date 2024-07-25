import React from "react";
import { createClient } from "@/utils/supabase/client";
import { DiaryEntry, TodoListType } from "@/types/diary.type";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
// 서버 측에서 데이터 패칭하기
async function getDiaryDetail(id: string): Promise<DiaryEntry | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("diaries").select("*").eq("diary_id", id).single();

  if (error || !data) {
    return null;
  }

  return data as DiaryEntry;
}

interface DiaryDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    itemIndex: string;
    todosData?: string;
  };
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = async ({ params, searchParams }) => {
  const { id } = params;
  const { itemIndex, todosData } = searchParams;

  const diary = await getDiaryDetail(id);
  if (!diary) {
    return <div>상세내용 찾을 수 없습니다.</div>;
  }
  const diaryContents = DOMPurify.sanitize(diary.content[Number(itemIndex)]?.content || "");

  let todosArray: TodoListType[] = [];
  if (todosData) {
    try {
      const decodedTodosData = decodeURIComponent(todosData);
      todosArray = JSON.parse(decodedTodosData);
    } catch (error) {
      console.error("Error parsing todosData:", error);
    }
  }
  const currentPageData = {
    diary: diary,
    itemIndex: itemIndex,
    todosArray: todosArray
  };
  const encodedPageData = encodeURIComponent(JSON.stringify(currentPageData));
  return (
    <div>
      <h1>Diary Details</h1>
      <p>날짜: {diary.created_at.split("T")[0]}</p>
      <p>여기가 투두리스트입니다.</p>
      {todosArray.length > 0 && (
        <div>
          <h3>To-Do List</h3>
          <ul>
            {todosArray.map((todo: any) => (
              <li key={todo.todo_id}>{todo.todo_title}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4">여기서 부터 다이얼 내용입니다.</p>
      <p>{diary.content[Number(itemIndex)]?.title}</p>
      <div dangerouslySetInnerHTML={{ __html: diaryContents }} />
      <div>
        <Link href={`/diary/write-diary/${id}?data=${encodedPageData}`}>
          <button>추가</button>
        </Link>
        <button>삭제</button>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
