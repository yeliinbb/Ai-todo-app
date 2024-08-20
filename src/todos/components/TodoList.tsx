import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Todo } from "../types";
import TodoCard from "./TodoCard";
import { ReactNode, useState } from "react";

interface TodoListProps {
  todos: Todo[];
  className?: string;
  title: ReactNode;
  contents?: ReactNode;
  inlineForm?: ReactNode;
}

const TodoList = ({ todos, className, title, contents, inlineForm }: TodoListProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div
      className={`rounded-[2rem] my-[0.06rem] bg-system-white px-[0.75rem] shadow-sm desktop:px-[1.25rem] desktop:border-[0.06rem] ${className}`}
    >
      <div
        className="flex items-center justify-between p-[1rem] cursor-pointer desktop:py-[1.25rem]"
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
          {/* 투두가 없을 경우 contents 렌더링 */}
          {todos.length === 0 ? contents : null}

          {inlineForm}

          {/* 투두가 있을 경우 투두 리스트 렌더링 */}
          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
