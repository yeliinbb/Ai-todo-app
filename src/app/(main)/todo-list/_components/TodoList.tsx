"use client";

import { useState } from "react";
import dayjs from "dayjs";

const TodoList = ({ todos, addTodo, updateTodo, deleteTodo }: any) => {
  const [showToday, setShowToday] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleCheckboxChange = (todo: any) => {
    const updatedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(updatedTodo);
  };

  const todayTodos = todos?.filter(
    (todo: any) => !todo.is_done && dayjs(todo.event_datetime).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
  );

  const completedTodos = todos?.filter((todo: any) => todo.is_done);

  return (
    <div className="flex flex-col items-center">
      {/* 오늘섹션 */}
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => setShowToday(!showToday)}>
          오늘
        </h2>
        {showToday && (
          <ul className="list-disc list-inside">
            {todayTodos?.map((todo: any) => (
              <li key={todo.todo_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => handleCheckboxChange(todo)}
                  className="mr-2"
                />
                <span>{todo.todo_title}</span>
                <span>{dayjs(todo.event_datetime).format("YYYY-MM-DD")}</span>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* 완료섹션 */}
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => setShowCompleted(!showCompleted)}>
          완료
        </h2>
        {showCompleted && (
          <ul className="list-disc list-inside">
            {completedTodos?.map((todo: any) => (
              <li key={todo.todo_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => handleCheckboxChange(todo)}
                  className="mr-2"
                />
                <span className="line-through">{todo.todo_title}</span>
                <span>{dayjs(todo.event_datetime).format("YYYY-MM-DD")}</span>
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
