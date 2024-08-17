import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Todo } from "../types";
import TodoCard from "./TodoCard";
import { cn } from "@/shared/utils";
import { ReactNode, useState } from "react";
import TodoListStatusMessageCard from "./TodoListStatusMessageCard";

interface TodoListProps {
  todos: Todo[];
  className?: string;
  messageCard?: ReactNode;
  title: ReactNode;
}

const TodoList = ({ todos, className, messageCard, title }: TodoListProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mt-4"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {title}
        {isCollapsed ? (
          <IoChevronDown size={24} className="text-gray-700" />
        ) : (
          <IoChevronUp size={24} className="text-gray-700" />
        )}
      </div>

      {/* 투두 상태 메세지(독려, 응원, 칭찬) 카드 */}
      {(todos.length === 0 ?? title) ? <TodoListStatusMessageCard title={messageCard} className={className} /> : null}

      {!isCollapsed && (
        <ul className="flex flex-col items-start self-stretch gap-2 min-w-[343px] my-2">
          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
