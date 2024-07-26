import { createClient } from "@/utils/supabase/client";
import { TodoListType } from "@/types/diary.type";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

interface DiaryData {
  diary_id: string;
  created_at: string;
  content: { title: string; content: string; diary_id: string };
  user_id: string;
  isFetching_todo: boolean;
}

async function getDiaryDetail(id: string, diaryIndex: number) {

  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("diaries").select("*").eq("diary_id", id).single();

    if (error) {
      console.error("Error fetching diary detail:", error);
    }
    if (data && Array.isArray(data.content)) {
      // revalidatePath("/", "page");
      const diaryDetail = {
        created_at: data.created_at.split("T")[0],
        content: data.content[diaryIndex] as { title: string; content: string; diary_id: string }
      };
      return diaryDetail;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

interface DiaryDetailPageProps {
  params: { id: string };
  searchParams: { itemIndex: string; todosData?: string };
}

const DiaryDetailPage = async ({ params, searchParams }: DiaryDetailPageProps) => {
  const { id } = params;
  const diary = await getDiaryDetail(id, +searchParams.itemIndex);
  if (!diary) {
    return <div>상세내용 찾을 수 없습니다.</div>;
  }
  const todosData = searchParams.todosData || "";

  let todosArray: TodoListType[] = [];

  const diaryContents = DOMPurify.sanitize(diary.content.content);

  if (todosData) {
    try {
      const decodedTodosData = decodeURIComponent(todosData);
      todosArray = JSON.parse(decodedTodosData);
    } catch (error) {
      console.error("Error parsing todosData:", error);
    }
  }

  const currentPageData = {
    diary: diary.content,
    itemIndex: +searchParams.itemIndex,
    todosArray: todosArray
  };
  const encodedPageData = encodeURIComponent(JSON.stringify(currentPageData));

  return (
    <div>
      <h1>Diary Details</h1>
      <p>날짜: {diary.created_at}</p>
      <p>여기가 투두리스트입니다.</p>
      {todosArray.length > 0 && (
        <div>
          <h3>To-Do List</h3>
          <ul>
            {todosArray.map((todo) => (
              <li key={todo.todo_id}>{todo.todo_title}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4">여기서 부터 다이얼 내용입니다.</p>
      <p>{diary.content.title}</p>
      <div dangerouslySetInnerHTML={{ __html: diaryContents }} />
      <div>
        <Link href={`/diary/write-diary/${id}?data=${encodedPageData}`}>
          <button>수정</button>
        </Link>
        <button>삭제</button>
      </div>
    </div>
  );
};
export default DiaryDetailPage;
