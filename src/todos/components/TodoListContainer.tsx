"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useTodos } from "../useTodos";
import { Todo } from "../types";
import EditTodoForm, { EditTodoFormData } from "./EditTodoForm";
import { AddTodoFormData } from "./AddTodoForm";
import QuickAddTodoForm from "./QuickAddTodoForm";
import TodoList from "./TodoList";

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
  onSubmit?: (data: AddTodoFormData) => Promise<void>;
}

const TodoListContainer = ({ todos, selectedDate, onSubmit }: TodoListProps) => {
  const [showToday, setShowToday] = useState<boolean>(false);
  const [showTodayCompleted, setShowTodayCompleted] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todo>();
  const { updateTodo } = useTodos();
  dayjs.locale("ko");

  const todayTodos = todos.filter((todo) => !todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"));
  const completedTodayTodos = todos.filter(
    (todo) => todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day")
  );

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleEditSubmit = async (data: EditTodoFormData): Promise<void> => {
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
    <div className="flex flex-col bg-system-white rounded-t-[48px] shadow-inner w-full h-full pt-10 p-[18px]">
      <h2 className="cursor-pointer text-pai-700 mb-4" onClick={() => setShowToday((prev) => !prev)}>
        오늘 할 일
      </h2>
      <TodoList todos={todayTodos} isCollapsed={showToday} onClick={handleEditClick} />
      <QuickAddTodoForm onSubmit={onSubmit} />
      <h2 className="cursor-pointer text-gray-700 mb-4" onClick={() => setShowTodayCompleted((prev) => !prev)}>
        완료한 일
      </h2>
      <TodoList todos={completedTodayTodos} isCollapsed={showTodayCompleted} onClick={handleEditClick} />
      {editingTodo && (
        <EditTodoForm todo={editingTodo} onSubmit={(data) => handleEditSubmit(data)} selectedDate={selectedDate} />
      )}
    </div>
  );
};

export default TodoListContainer;
