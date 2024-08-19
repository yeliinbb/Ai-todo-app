import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Todo } from "../types";
import TodoCard from "./TodoCard";
import { ReactNode, useState } from "react";
import { useAddTodo } from "../useAddTodo";
import QuickAddTodoForm from "./QuickAddTodoForm";

interface TodoListProps {
  todos: Todo[];
  className?: string;
  messageCard?: ReactNode;
  title: ReactNode;
  selectedDate: Date;
}

const TodoList = ({ todos, className, messageCard, title, selectedDate }: TodoListProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { handleAddTodoSubmit } = useAddTodo(selectedDate);

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
          {/* 투두 상태 메세지(독려, 응원, 칭찬) 카드 */}
          {(todos.length === 0 ?? title) ? messageCard : null}

          <QuickAddTodoForm onSubmit={handleAddTodoSubmit} />

          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
