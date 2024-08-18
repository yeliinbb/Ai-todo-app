import { Todo } from "../types";
import TodoCard from "./TodoCard";
import { cn } from "@/shared/utils";
import { ReactNode } from "react";

interface TodoListProps {
  todos: Todo[];
  isCollapsed: boolean;
  className?: string;
  title?: ReactNode;
}

const TodoList = ({ todos, isCollapsed, className, title }: TodoListProps) => {
  return (
    <div>
      {todos.length === 0 ? (
        // 독려, 응원, 칭찬 카드 (TodoListContainer에 있지만 컴포넌트 분리하기)
        <div
          className={cn(
            `flex items-center border border-solid border-pai-300 bg-paiTrans-40080 rounded-[32px] w-full h-[76px] p-4 mt-4`,
            className
          )}
        >
          {title}
        </div>
      ) : null}
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
