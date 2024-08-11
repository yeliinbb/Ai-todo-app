"use client";

import dayjs from "dayjs";
import { Todo } from "../types";
import { useTodos } from "../useTodos";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu";
import { useUserData } from "@/hooks/useUserData";
import useModal from "@/hooks/useModal";

export interface TodoCardProps {
  todo: Todo;
  onClick: (todo: Todo) => void;
}

const TodoCard = ({ todo, onClick }: TodoCardProps) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { updateTodo, deleteTodo } = useTodos(userId!);
  const [isChecked, setIsChecked] = useState<boolean>(todo.is_done ?? false);
  const { openModal, Modal } = useModal();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    const checkedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(checkedTodo);
  };

  const handleDeleteTodo = () => {
    openModal(
      {
        message: "삭제하시면 복구가 어렵습니다.\n정말 삭제하시겠습니까?",
        confirmButton: { text: "삭제", style: "삭제" }
      },
      () => deleteTodo(todo.todo_id)
    );
  };

  return (
    <>
      <Modal />
      <li
        className={`flex flex-col p-4 gap-4 self-stretch border border-solid rounded-[32px] ${isChecked ? "border-grayTrans-20060 bg-grayTrans-20032" : "border-pai-100 bg-whiteTrans-wh72"}`}
      >
        <div className="flex items-center gap-3 self-stretch">
          <div className="flex items-center gap-1 pt-1">
            <label htmlFor={todo.todo_id} className="select-none">
              <input
                type="checkbox"
                id={todo.todo_id}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="hidden"
              />
              {isChecked ? (
                <IoCheckmarkCircle className="w-9 h-9 text-pai-400" />
              ) : (
                <IoCheckmarkCircleOutline className="w-9 h-9 text-pai-400" />
              )}
            </label>
          </div>
          <div className="flex flex-1 items-center justify-between min-w-0">
            <div
              className={`flex flex-col items-start self-stretch w-[207px] min-w-0 ${!todo.todo_description ? "items-center" : ""}`}
            >
              <p className={`${isChecked ? "text-gray-700" : ""} truncate w-full`}>{todo.todo_title}</p>
              {todo.todo_description && (
                <p className={`${isChecked ? "text-gray-400" : "text-gray-600"} truncate w-full`}>
                  {todo.todo_description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex justify-center items-center w-9 h-9 p-0 border border-solid border-gray-700 rounded-full cursor-pointer">
                  <IoIosMore className="w-5 h-5 text-gray-700" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onClick(todo)}>수정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteTodo}>삭제</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex justify-end items-start gap-1.5 self-stretch">
          {!todo.is_all_day_event && todo.event_datetime && (
            <span
              className={`flex justify-center items-center gap-1 px-3 py-0 rounded-full ${isChecked ? "bg-gray-200" : "bg-pai-300"}`}
            >
              <IoTimeOutline className={`w-4 h-4 mr-1 ${isChecked ? "text-gray-900" : "text-system-white"}`} />
              <p className={`text-xs ${isChecked ? "text-gray-700" : "text-system-white"}`}>
                {dayjs(todo.event_datetime).format("A hh:mm")}
              </p>
            </span>
          )}
        </div>
      </li>
    </>
  );
};

export default TodoCard;
