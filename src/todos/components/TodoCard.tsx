import dayjs from "dayjs";
import { Todo } from "../types";
import { useTodos } from "../useTodos";

interface TodoCardProps {
  todo: Todo;
  onClick: (todo: Todo) => void;
}

const TodoCard = ({ todo, onClick }: TodoCardProps) => {
  const { updateTodo, deleteTodo } = useTodos();

  const handleCheckboxChange = () => {
    const checkedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(checkedTodo);
  };

  return (
    <li className="flex items-center">
      <input type="checkbox" checked={todo.is_done ?? false} onChange={handleCheckboxChange} className="mr-2" />
      <span className={todo.is_done ? "line-through" : ""}>{todo.todo_title}</span>
      <span>{dayjs(todo.event_datetime).format("A hh:mm")}</span>
      {/* 버튼 컴포넌트 분리 및 위치 이동(디테일폼 하단에 위치) */}
      <div>
        <button onClick={() => onClick(todo)}>수정</button>
        <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
      </div>
    </li>
  );
};

export default TodoCard;
