import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Todo } from "../types";
import TodoCard from "./TodoCard";
import { cn } from "@/shared/utils";
import { ReactNode, useState } from "react";

interface TodoListProps {
  todos: Todo[];
  className?: string;
  messageCard?: ReactNode;
  title: ReactNode;
}

const TodoList = ({ todos, className, messageCard, title }: TodoListProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="rounded-[2rem] my-[0.06rem] bg-system-white px-[0.75rem] shadow-sm">
      <div
        className="flex items-center justify-between p-[1rem] cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {title}
        {isCollapsed ? (
          <IoChevronDown size={24} className="text-gray-700" />
        ) : (
          <IoChevronUp size={24} className="text-gray-700" />
        )}
      </div>

      {!isCollapsed && (
        <ul className="flex flex-col items-start self-stretch gap-[0.5rem] min-w-[19.9375rem] mb-[1.25rem]">
          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
