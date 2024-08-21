"use client";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Todo } from "../types";
import { TodoFormData } from "./TodoForm";
import TodoList from "./TodoList";
import useModal from "@/hooks/useModal";
import CheckIcon from "@/components/icons/todo-list/Check";
import CircleCheckFill from "@/components/icons/todo-list/CircleCheckFill";
import ThumbUp from "@/components/icons/todo-list/ThumbUp";
import { useAddTodo } from "../useAddTodo";
import QuickAddTodoForm from "./QuickAddTodoForm";
import { useState, useEffect } from "react";

interface TodoListContainerProps {
  todos: Todo[];
  selectedDate: Date;
  onSubmit?: (data: TodoFormData) => Promise<void>;
}

const TodoListContainer = ({ todos, selectedDate, onSubmit }: TodoListContainerProps) => {
  // const [editingTodo, setEditingTodo] = useState<Todo>();
  const [isDesktop, setIsDesktop] = useState(false);
  const { Modal } = useModal();
  const { handleAddTodoSubmit } = useAddTodo(selectedDate);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };
    updateIsDesktop();

    window.addEventListener("resize", updateIsDesktop);

    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);

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

  const isAllCompleted = todayTodos.length === 0 && completedTodayTodos.length > 0;

  // const handleEditClick = (todo: Todo) => {
  //   setEditingTodo(todo);
  // };

  const TodoListNode = (
    <>
      <TodoList
        // onClick={handleEditClick}
        todos={todayTodos}
        title={<h2 className="text-sh4 text-pai-700">오늘 할 일</h2>}
        className="desktop:border-2 desktop:border-pai-400"
        contents={
          isAllCompleted ? (
            <div className="flex items-center w-full min-w-[19.9375rem] px-[1.25rem] py-[1rem] rounded-full bg-pai-400">
              <ThumbUp className="w-[1.25rem] h-[1.25rem] mr-[0.75rem] text-system-white" />
              <p className="text-bc4 text-system-white">와우~ 할 일을 모두 완료하셨어요!</p>
            </div>
          ) : (
            <div className="flex items-center w-full min-w-[19.9375rem] px-[1.25rem] py-[1rem] rounded-full bg-gray-100">
              <CheckIcon className="w-[1.25rem] h-[1.25rem] mr-[0.75rem] text-gray-400" />
              <p className="text-bc4 text-gray-400">작성된 투두리스트가 없습니다</p>
            </div>
          )
        }
        inlineForm={<QuickAddTodoForm onSubmit={handleAddTodoSubmit} />}
      />

      <TodoList
        // onClick={handleEditClick}
        todos={completedTodayTodos}
        title={<h2 className="text-sh4 text-gray-700">완료한 일</h2>}
        className="desktop:border-2 desktop:border-gray-400"
        contents={
          completedTodayTodos.length === 0 ? (
            <div className="flex items-center w-full min-w-[19.9375rem] px-[1.25rem] py-[1rem] rounded-full bg-gray-100">
              <CircleCheckFill className="w-[1.25rem] h-[1.25rem] mr-[0.75rem] text-gray-400" />
              <p className="text-bc4 text-gray-400">완성된 투두리스트가 없습니다</p>
            </div>
          ) : null
        }
      />
    </>
  );

  return (
    <>
      <Modal />
      <div className="flex flex-col w-full h-full pb-[100px] px-4 gap-[1.25rem] max-w-[39.3rem] desktop:gap-[2rem] desktop:p-0">
        {isDesktop ? (
          <>
            <div className="flex flex-col w-full h-full pb-[100px] px-4 gap-[1.25rem] max-w-[39.3rem] desktop:gap-[2rem] desktop:p-0 rounded-t-[5.63rem] bg-system-white bg-gradient-to-b">
              <div className="flex flex-col items-start self-stretch h-full">
                <div className="w-full flex flex-col items-center gap-[0.625rem] px-[3.25rem] py-[1.75rem]">
                  <p className="text-bc2 text-pai-900">{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</p>
                </div>
                <div className="w-full bg-gradient-to-b flex flex-col gap-[2rem] px-[2.75rem] py-[2rem] pb-[78px] overflow-y-auto scrollbar-hide scrollbar-smooth">
                  {TodoListNode}
                </div>
              </div>
            </div>
          </>
        ) : (
          TodoListNode
        )}
        {/* <EditTodoDrawer todo={editingTodo} onClose={() => setEditingTodo(undefined)} /> */}
      </div>
    </>
  );
};

export default TodoListContainer;
