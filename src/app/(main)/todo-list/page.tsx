import TodoListPage from "@/todos/components/TodoListPage";
import { supabase } from "@/utils/supabase/client";

const Page = async () => {
  const { data, error } = await supabase.from("todos").select("*");
  // console.log("data", data);

  return (
    <>
      <TodoListPage todos={data ?? []} />
    </>
  );
};

export default Page;
