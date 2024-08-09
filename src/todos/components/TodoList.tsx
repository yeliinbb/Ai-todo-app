import { Todo } from "../types";
import TodoCard from "./TodoCard";
import { cn } from "@/shared/utils";
import { ReactNode } from "react";

interface TodoListProps {
  todos: Todo[];
  isCollapsed: boolean;
  onClick: (todo: Todo) => void;
  className?: string;
  title?: ReactNode;
}

const TodoList = ({ todos, isCollapsed, onClick, className, title }: TodoListProps) => {
  return (
    <div>
      {todos.length === 0 ? (
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
        <ul className="mt-4">
          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} onClick={onClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
