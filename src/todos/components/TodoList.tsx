"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useTodos } from "../useTodos";
import { Todo } from "../types";
import EditTodoForm, { EditTodoFormData } from "./EditTodoForm";
import TodoContainer from "./TodoListContainer";

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
}

const TodoList = ({ todos, selectedDate }: TodoListProps) => {
  const [showToday, setShowToday] = useState<boolean>(true);
  const [showTodayCompleted, setShowTodayCompleted] = useState<boolean>(true);
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
    <div className="flex flex-col items-center">
      <TodoContainer
        title="오늘 할 일"
        todos={todayTodos}
        isCollapsed={showToday}
        toggleCollapse={() => setShowToday((prev) => !prev)}
        onClick={handleEditClick}
      />
      <TodoContainer
        title="완료한 일"
        todos={completedTodayTodos}
        isCollapsed={showTodayCompleted}
        toggleCollapse={() => setShowTodayCompleted((prev) => !prev)}
        onClick={handleEditClick}
      />
      {editingTodo && (
        <EditTodoForm todo={editingTodo} onSubmit={(data) => handleEditSubmit(data)} selectedDate={selectedDate} />
      )}
    </div>
  );
};

export default TodoList;
