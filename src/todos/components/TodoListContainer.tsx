import { Todo } from "../types";
import TodoCard from "./TodoCard";

interface TodoContainerProps {
  title: string;
  todos: Todo[];
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onClick: (todo: Todo) => void;
}

const TodoContainer = ({ title, todos, isCollapsed, toggleCollapse, onClick }: TodoContainerProps) => {
  return (
    <div className="mt-4 w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={toggleCollapse}>
        {title}
      </h2>
      {!isCollapsed && (
        <ul className="list-disc list-inside">
          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} onClick={onClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoContainer;
