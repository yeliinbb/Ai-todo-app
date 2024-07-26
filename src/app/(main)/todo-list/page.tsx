import { fetchTodos } from "@/utils/todoApi";
import Calendar from "../_components/Calendar";
import TodoList from "./_components/TodoList";

const Page = async () => {
  const todos = await fetchTodos();

  return (
    <div>
      <Calendar todos={todos} />
      <TodoList todos={todos} />
    </div>
  );
};

export default Page;
