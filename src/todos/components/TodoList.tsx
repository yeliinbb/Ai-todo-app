import { Todo } from "../types";
import TodoCard from "./TodoCard";

interface TodoContainerProps {
  todos: Todo[];
  isCollapsed: boolean;
  onClick: (todo: Todo) => void;
}

const TodoList = ({ todos, isCollapsed, onClick }: TodoContainerProps) => {
  return (
    <div className="mb-4">
      {!isCollapsed && (
        <ul>
          {todos.map((todo) => (
            <TodoCard key={todo.todo_id} todo={todo} onClick={onClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
