"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Todo } from "../types";
import { TodoFormData } from "./TodoForm";
import QuickAddTodoForm from "./QuickAddTodoForm";
import TodoList from "./TodoList";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import TodoDetailDrawer from "./TodoDetailDrawer";
import { FaClipboardCheck, FaRegThumbsUp } from "react-icons/fa";
import useModal from "@/hooks/useModal";

interface TodoListContainerProps {
  todos: Todo[];
  selectedDate: Date;
  onSubmit?: (data: TodoFormData) => Promise<void>;
}

const TodoListContainer = ({ todos, selectedDate, onSubmit }: TodoListContainerProps) => {
  const [showToday, setShowToday] = useState<boolean>(false);
  const [showTodayCompleted, setShowTodayCompleted] = useState<boolean>(false);
  // const [editingTodo, setEditingTodo] = useState<Todo>();
  const { data } = useUserData();
  const userId = data?.user_id;
  const router = useRouter();
  const { openModal, Modal } = useModal();

  const handleCheckLogin = () => {
    openModal(
      {
        message: "로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동합니다.",
        confirmButton: { text: "확인", style: "시스템" }
      },
      () => router.push("/login")
    );
  };

  const handleAuthRequire = () => {
    if (!userId) {
      handleCheckLogin();
    }
  };

  dayjs.locale("ko");

  // refactoring to be : TodoList.tsx로 로직 이동, 애는 Container의 역할만 하도록 분리하기
  const sortTodos = (a: Todo, b: Todo) => {
    const getDate = (todo: Todo) => {
      return todo.is_all_day_event === false
        ? new Date(todo.event_datetime ?? todo.created_at)
        : new Date(todo.created_at);
    };

    if (a.is_all_day_event !== b.is_all_day_event) {
      return a.is_all_day_event ? 1 : -1;
    }

    const dateA = getDate(a);
    const dateB = getDate(b);

    return dateA.getTime() - dateB.getTime();
  };

  const todayTodos = todos
    .filter((todo) => !todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"))
    .sort(sortTodos);

  const completedTodayTodos = todos
    .filter((todo) => todo.is_done && dayjs(todo.event_datetime).isSame(selectedDate, "day"))
    .sort(sortTodos);

  const isTodayTodosAllCompleted = todayTodos.length === 0 && completedTodayTodos.length > 0;

  // const handleEditClick = (todo: Todo) => {
  //   setEditingTodo(todo);
  // };

  // 얘도 더 자주 쓰이거나 복잡해진다면 컴포넌트로 분리
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
    <>
      <Modal />
      <div className="flex flex-col bg-system-white rounded-t-[36px] shadow-inner w-full h-full pt-8 p-4">
        {/* 타이틀도 TodoList로 분리 */}
        <h2 className="cursor-pointer text-pai-700 mt-4" onClick={() => setShowToday((prev) => !prev)}>
          오늘 할 일
        </h2>
        <TodoList
          todos={todayTodos}
          isCollapsed={showToday}
          // onClick={handleEditClick}
          title={getTodoListPopCard()}
        />
        <QuickAddTodoForm onSubmit={onSubmit} onClick={handleAuthRequire} />
        {/* 타이틀도 TodoList로 분리 */}
        <h2 className="cursor-pointer text-gray-700 mt-4" onClick={() => setShowTodayCompleted((prev) => !prev)}>
          완료한 일
        </h2>
        <TodoList
          todos={completedTodayTodos}
          isCollapsed={showTodayCompleted}
          // onClick={handleEditClick}
          className="bg-grayTrans-20032 border-grayTrans-20060 shadow-inner"
          title={
            <>
              <IoCheckmarkCircle className="w-9 h-9 mr-2 text-gray-400" />
              <p className="text-gray-400">완성된 투두리스트가 없습니다.</p>
            </>
          }
        />
        {/* <EditTodoDrawer todo={editingTodo} onClose={() => setEditingTodo(undefined)} /> */}
      </div>
    </>
  );
};

export default TodoListContainer;
