import dayjs from "dayjs";
import { Todo } from "../types";
import { useTodos } from "../useTodos";

interface TodoContainerProps {
  title: string;
  todos: Todo[];
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onClick: (todo: Todo) => void;
}

const TodoContainer = ({ title, todos, isCollapsed, toggleCollapse, onClick }: TodoContainerProps) => {
  const { updateTodo, deleteTodo } = useTodos();

  const handleCheckboxChange = (todo: Todo) => {
    const checkedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(checkedTodo);
  };

  return (
    <div className="mt-4 w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={toggleCollapse}>
        {title}
      </h2>
      {!isCollapsed && (
        <ul className="list-disc list-inside">
          {todos.map((todo) => (
            <li key={todo.todo_id} className="flex items-center">
              <input
                type="checkbox"
                checked={todo.is_done ?? false}
                onChange={() => handleCheckboxChange(todo)}
                className="mr-2"
              />
              <span className={todo.is_done ? "line-through" : ""}>{todo.todo_title}</span>
              <span>{dayjs(todo.event_datetime).format("A hh:mm")}</span>
              <div>
                <button onClick={() => onClick(todo)}>수정</button>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoContainer;
