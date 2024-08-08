"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Todo } from "../types";
import { TodoFormData } from "./AddTodoForm";
import QuickAddTodoForm from "./QuickAddTodoForm";
import TodoList from "./TodoList";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import EditTodoDrawer from "./EditTodoDrawer";
import { toast } from "react-toastify";
import { FaClipboardCheck, FaRegThumbsUp } from "react-icons/fa";
interface TodoListContainerProps {
  todos: Todo[];
  selectedDate: Date;
  onSubmit?: (data: TodoFormData) => Promise<void>;
}

const TodoListContainer = ({ todos, selectedDate, onSubmit }: TodoListContainerProps) => {
  const [showToday, setShowToday] = useState<boolean>(false);
  const [showTodayCompleted, setShowTodayCompleted] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todo>();
  const { data } = useUserData();
  const userId = data?.user_id;
  const router = useRouter();

  const handleAuthRequire = () => {
    if (!userId) {
      toast.warn("로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동합니다.", {
        onClose: () => {
          router.push("/login");
        }
      });
      router.push("/login");
      return;
    }
  };

  dayjs.locale("ko");

  const sortTodos = (a: Todo, b: Todo) => {
    return new Date(a.event_datetime ?? a.created_at).getTime() - new Date(b.event_datetime ?? b.created_at).getTime();
  };

  const todayTodos = todos
    .filter((todo) => !todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"))
    .sort(sortTodos);

  const completedTodayTodos = todos
    .filter((todo) => todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"))
    .sort(sortTodos);

  const isTodayTodosAllCompleted = todayTodos.length === 0 && completedTodayTodos.length > 0;

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const getTodoListPopCard = () => {
    if (isTodayTodosAllCompleted) {
      return (
        <>
          <FaRegThumbsUp className="w-9 h-9 mr-2 text-system-white" />
          <p className="text-system-white">와우~ 할 일을 모두 완료하셨어요!</p>
        </>
      );
    }
    return (
      <>
        <FaClipboardCheck className="w-9 h-9 mr-2 text-system-white" />
        <p className="text-system-white">오늘의 할 일이 있나요?</p>
      </>
    );
  };

  return (
    <div className="flex flex-col bg-system-white rounded-t-[36px] shadow-inner w-full h-full pt-8 p-4">
      <h2 className="cursor-pointer text-pai-700 mt-4" onClick={() => setShowToday((prev) => !prev)}>
        오늘 할 일
      </h2>
      <TodoList todos={todayTodos} isCollapsed={showToday} onClick={handleEditClick} title={getTodoListPopCard()} />
      <QuickAddTodoForm onSubmit={onSubmit} onClick={handleAuthRequire} />
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
            <IoCheckmarkCircle className="w-9 h-9 mr-2 text-gray-400" />
            <p className="text-gray-400">완성된 투두리스트가 없습니다.</p>
          </>
        }
      />
      <EditTodoDrawer todo={editingTodo} onClose={() => setEditingTodo(undefined)} />
    </div>
  );
};

export default TodoListContainer;
