"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useTodos } from "../useTodos";
import { Todo } from "../types";
import EditTodoForm, { EditTodoFormData } from "./EditTodoForm";

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
}

const TodoList = ({ todos, selectedDate }: TodoListProps) => {
  const [showToday, setShowToday] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo>();
  const { updateTodo, deleteTodo } = useTodos();

  dayjs.locale("ko");

  const handleCheckboxChange = (todo: Todo) => {
    const checkedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(checkedTodo);
  };

  const todayTodos = todos.filter((todo) => !todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"));
  const completedTodos = todos.filter((todo) => todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"));

  const handleClickEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleEditSubmit = async (data: EditTodoFormData) => {
    if (editingTodo === undefined) {
      return;
    }
    const eventDateTime = data.eventTime
      ? dayjs(editingTodo?.event_datetime).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : null;
    updateTodo({
      todo_id: editingTodo.todo_id,
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      address: data.address
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div>{dayjs(selectedDate).format("YY-MM-DD")}</div>
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
                <button onClick={() => handleClickEdit(todo)}>수정</button>
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
                <button>수정</button>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {editingTodo && <EditTodoForm todo={editingTodo} onSubmit={(data) => handleEditSubmit(data)} />}
    </div>
  );
};

export default TodoList;
