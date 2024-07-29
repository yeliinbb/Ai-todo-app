import SearchTodoBtn from "@/todos/components/SearchTodoBtn";
import TodoListPage from "@/todos/components/TodoListPage";
import { supabase } from "@/utils/supabase/client";

const Page = async () => {
  const { data, error } = await supabase.from("todos").select("*");
  return (
    <>
      <SearchTodoBtn />
      <TodoListPage todos={data ?? []} />
    </>
  );
};

export default Page;
