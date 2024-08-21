import { DiaryData, TodoListType } from "@/types/diary.type";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import DiaryDeleteButton from "@/app/(main)/diary/_components/DiaryDeleteButton";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { createClient } from "@/utils/supabase/server";
import DiaryWriteHeader from "../../_components/DiaryWriteHeader";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Todolist from "../../_components/Todolist";
import detailStyle from "@/app/(main)/diary/_components/DiaryDetailPage.module.css";
import DiaryDetailContent from "../../_components/DiaryDetailContent";
dayjs.locale("ko");

async function getDiaryDetail(id: string, diaryIndex: number) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from(DIARY_TABLE).select("*").eq("diary_id", id).single();

    if (error) {
      console.error("Error fetching diary detail:", error);
    }
    if (data && Array.isArray(data.content)) {
      const diaryDetail = {
        diary_id: data.diary_id,
        user_id: data.user_id,
        created_at: data.created_at.split("T")[0],
        content: data.content
      };
      return diaryDetail as DiaryData;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
//투두 리드스트 가져올지 아닐지는 isFetching_todo의 값에 따라 다름
async function getTodosByDate(userId: string, date: string): Promise<TodoListType[]> {
  const supabase = createClient();
  try {
    const searchDate = date ? new Date(date) : new Date();
    const startDate = new Date(searchDate);
    // startDate.setUTCHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    // endDate.setUTCHours(23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .gte("event_datetime", startDate.toISOString())
      .lt("event_datetime", endDate.toISOString())
      .order("event_datetime", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data as TodoListType[];
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

interface DiaryDetailPageProps {
  params: { id: string };
  searchParams: { itemIndex: string };
}

const DiaryDetailPage = async ({ params, searchParams }: DiaryDetailPageProps) => {
  const { id } = params;
  const diary = await getDiaryDetail(id, +searchParams.itemIndex);
  const diartIndex: number = +searchParams.itemIndex ? +searchParams.itemIndex : 0;
  const formatSelectedDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일");
  };

  if (!diary) {
    return <div>상세내용 찾을 수 없습니다.</div>;
  }
  console.log(diary);
  console.log(diartIndex);
  // let todosArray: TodoListType[] = [];
  const diaryContents = DOMPurify.sanitize(diary.content[diartIndex].content);

  // if (diary.content.isFetching_todo) {
  //   todosArray = await getTodosByDate(userId!, diary.created_at);
  // }
  console.log(diaryContents)
  const firstDiary = diary.content.length <= 1;

  const currentPageData = {
    diary: diary.content[+searchParams.itemIndex],
    itemIndex: diartIndex
  };

  const deleteTargetDiary = {
    diary_id: diary.diary_id,
    content: diary.content[diartIndex]
  };
  const encodedPageData = encodeURIComponent(JSON.stringify(currentPageData));

  return (
    <div className="flex flex-col justify-between bg-gray-100 desktop:h-screen mobile:h-[100dvh]">
      <DiaryWriteHeader headerText={formatSelectedDate(diary.created_at)} firstDiary={firstDiary} />
      <div className="bg-system-white rounded-t-[48px] flex flex-col desktop:h-[calc(100vh-6.25rem)] mobile:h-[calc(100dvh-6.25rem)] flex-grow flex-shrink-0 border-b-0">
        {/* <div className="text-center h-[32px] flex items-center justify-center mb-[8px] w-[calc(100%-32px)] mx-auto">
          <span className="text-gray-600 tracking-[0.8px]">{formatSelectedDate(diary.created_at)}</span>
        </div> */}
        <div className="border-b w-[calc(100%-2.5rem)] mx-auto py-3 mt-4 ">
          <p className="text-left text-sh4 font-bold h-7">{diary.content[diartIndex].title}</p>
        </div>
        {/* <div className="w-[calc(100%-32px)] mx-auto">
          {diary.content.isFetching_todo ? <Todolist todos={todosArray} /> : null}
        </div> */}
        <div className="ql-container desktop:h-[calc(100vh-12.75rem)] mobile:h-[calc(100dvh-12.75rem)]  overflow-y-auto">
          <DiaryDetailContent diaryContents={diaryContents} />
        </div>
        <div className="flex justify-center gap-4 w-full h-20 items-center">
          <Link
            href={`/diary/write-diary/${id}?data=${encodedPageData}`}
            className="w-[163px] h-10 bg-fai-500 text-center py-1.5 px-6 rounded-full houver:bg-fai-300 transition-all block"
          >
            <p className="text-h7 text-system-white">수정</p>
          </Link>
          <DiaryDeleteButton
            targetDiary={diary.diary_id}
            targetDiaryContentId={diary.content[diartIndex].diary_id}
            buttonStyle="w-[163px] h-10 bg-system-error text-center py-1.5 px-6 rounded-full houver:bg-fai-300 transition-all"
            textStyle="text-h7 text-system-white"
          />
        </div>
      </div>
    </div>
  );
};
export default DiaryDetailPage;
