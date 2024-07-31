"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useTodos } from "../useTodos";
import { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
}
const TodoList = ({ todos, selectedDate }: TodoListProps) => {
  const [showToday, setShowToday] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const { updateTodo, deleteTodo } = useTodos();

  dayjs.locale("ko");

  const handleCheckboxChange = (todo: Todo) => {
    const checkedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(checkedTodo);
  };

  const todayTodos = todos.filter((todo) => !todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"));
  const completedTodos = todos.filter((todo) => todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"));

  return (
    <div className="flex flex-col items-center">
      <div>{dayjs().format("YYYY년 M월 D일 ddd요일")}</div>
      {/* 오늘섹션 */}
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => setShowToday((prev) => !prev)}>
          Todo
        </h2>
        {showToday && (
          <ul className="list-disc list-inside">
            {todayTodos.map((todo) => (
              <li key={todo.todo_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.is_done ?? false}
                  onChange={() => handleCheckboxChange(todo)}
                  className="mr-2"
                />
                <span className={todo.is_done ? "line-through" : ""}>{todo.todo_title}</span>
                <span>{dayjs(todo.created_at).format("A hh:mm")}</span>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* 완료섹션 */}
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => setShowCompleted((prev) => !prev)}>
          Done
        </h2>
        {showCompleted && (
          <ul className="list-disc list-inside">
            {completedTodos.map((todo) => (
              <li key={todo.todo_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.is_done ?? false}
                  onChange={() => handleCheckboxChange(todo)}
                  className="mr-2"
                />
                <span className="line-through">{todo.todo_title}</span>
                <span>{dayjs(todo.created_at).format("A hh:mm")}</span>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;
