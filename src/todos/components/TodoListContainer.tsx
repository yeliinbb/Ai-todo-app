"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useTodos } from "../useTodos";
import { Todo } from "../types";
import EditTodoForm, { EditTodoFormData } from "./EditTodoForm";
import { TodoFormData } from "./AddTodoForm";
import QuickAddTodoForm from "./QuickAddTodoForm";
import TodoList from "./TodoList";
import { IoIosThumbsUp } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useUserData } from "@/hooks/useUserData";
import DetailTodoDrawer from "./DetailTodoDrawer";

interface TodoListContainerProps {
  todos: Todo[];
  selectedDate: Date;
  onSubmit?: (data: TodoFormData) => Promise<void>;
}

const TodoListContainer = ({ todos, selectedDate, onSubmit }: TodoListContainerProps) => {
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
    <div className="flex flex-col bg-system-white rounded-t-[36px] shadow-inner w-[375px] h-full pt-8 p-4">
      <h2 className="cursor-pointer text-pai-700 mt-4" onClick={() => setShowToday((prev) => !prev)}>
        오늘 할 일
      </h2>
      <TodoList
        todos={todayTodos}
        isCollapsed={showToday}
        onClick={handleEditClick}
        title={
          <>
            <IoIosThumbsUp type="submit" className="w-9 h-9 mr-2 text-system-white" />
            <p className="text-system-white">와우~ 할 일을 모두 완료하셨어요!</p>
          </>
        }
      />
      <QuickAddTodoForm onSubmit={onSubmit} />
      <h2 className="cursor-pointer text-gray-700 mt-4" onClick={() => setShowTodayCompleted((prev) => !prev)}>
        완료한 일
      </h2>
      <TodoList
        todos={completedTodayTodos}
        isCollapsed={showTodayCompleted}
        onClick={handleEditClick}
        className="bg-grayTrans-20032 border-grayTrans-20060 shadow-inner"
        title={
          <>
            <IoCheckmarkCircle type="submit" className="w-9 h-9 mr-2 text-gray-400" />
            <p className="text-gray-400">완성된 투두리스트가 없습니다.</p>
          </>
        }
      />
      {editingTodo && (
        <DetailTodoDrawer todo={editingTodo} onSubmit={(data) => handleEditSubmit(data)} selectedDate={selectedDate} />
      )}
    </div>
  );
};

export default TodoListContainer;
