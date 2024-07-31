import TodoListPage from "@/todos/components/TodoListPage";
import { supabase } from "@/utils/supabase/client";

export const revalidate = 60

const Page = async () => {
  const { data, error } = await supabase.from("todos").select("*");
  console.log(data?.length)
  // 서버 컴포넌트는 한번 가져오고 캐싱돼서 렌더링 돼도 안바뀜 -> SSG? 처음에 다 완성된 전체로 한 번만 가져오기 때문

  return (
    <>
      <TodoListPage todos={data ?? []} />
    </>
  );
};

export default Page;
