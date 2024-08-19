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

interface TodoListContainerProps {
  todos: Todo[];
  selectedDate: Date;
  onSubmit?: (data: TodoFormData) => Promise<void>;
}

const TodoListContainer = ({ todos, selectedDate, onSubmit }: TodoListContainerProps) => {
  // const [editingTodo, setEditingTodo] = useState<Todo>();
  const { Modal } = useModal();
  const { handleAddTodoSubmit } = useAddTodo(selectedDate);

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

  return (
    <>
      <Modal />
      <div className="flex flex-col w-full h-full pb-[100px] px-4 gap-[1.25rem] max-w-[39.3rem] desktop:min-w-[39.3rem] desktop:gap-[2rem]">
        <TodoList
          // onClick={handleEditClick}
          todos={todayTodos}
          title={<h2 className="text-sh4 text-pai-700">오늘 할 일</h2>}
          className="border-pai-300 bg-paiTrans-40080"
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
          className="bg-grayTrans-20032 border-grayTrans-20060 shadow-inner"
          contents={
            completedTodayTodos.length === 0 ? (
              <div className="flex items-center w-full min-w-[19.9375rem] px-[1.25rem] py-[1rem] rounded-full bg-gray-100">
                <CircleCheckFill className="w-[1.25rem] h-[1.25rem] mr-[0.75rem] text-gray-400" />
                <p className="text-bc4 text-gray-400">완성된 투두리스트가 없습니다</p>
              </div>
            ) : null
          }
        />

        {/* <EditTodoDrawer todo={editingTodo} onClose={() => setEditingTodo(undefined)} /> */}
      </div>
    </>
  );
};

export default TodoListContainer;
