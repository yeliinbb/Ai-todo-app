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
import MenuIcon from "../../assets/menu.svg";

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
        className={`border border-solid ${isChecked ? "border-grayTrans-20060 bg-grayTrans-20032" : "border-pai-100 bg-whiteTrans-wh72"} rounded-[32px] shadow-inner p-4 mb-2`}
      >
        <div className="flex items-start">
          <label htmlFor={todo.todo_id} className="flex items-center select-non">
            <input
              type="checkbox"
              id={todo.todo_id}
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="hidden"
            />
            {isChecked ? (
              <IoCheckmarkCircle className="w-9 h-9 mr-2 text-pai-400" />
            ) : (
              <IoCheckmarkCircleOutline className="w-9 h-9 mr-2 text-pai-400" />
            )}
          </label>
          <div className="flex justify-between w-full">
            <div>
              <p className={isChecked ? "text-gray-700" : ""}>{todo.todo_title}</p>
              <p className={isChecked ? "text-gray-400" : "text-gray-600"}>{todo.todo_description}</p>
            </div>
            {/* 수정/삭제 버튼 생성 (디테일폼 하단에 위치) */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={`flex justify-center items-center w-9 h-9 border border-solid rounded-full cursor-pointer shadow-inner ${isChecked ? "text-gray-400" : "bg-whiteTrans-wh56 border-whiteTrans-wh72"} `}
                >
                  <IoIosMore className={`w-5 h-5 ${isChecked ? "text-gray-400" : "text-gray-600"}`} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onClick(todo)}>수정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteTodo}>삭제</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <MenuIcon />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {/* 뱃지 컴포넌트 분리 */}
          {!todo.is_all_day_event && todo.event_datetime && (
            <span
              className={`flex justify-center items-center rounded-full py-1 px-2.5 ${isChecked ? "bg-gray-200" : "bg-pai-300"}`}
            >
              <IoTimeOutline className={`w-4 h-4 mr-1 ${isChecked ? "text-gray-900" : "text-system-white"}`} />
              <p className={`text-xs ${isChecked ? "text-gray-700" : "text-system-white"}`}>
                {dayjs(todo.event_datetime).format("A hh:mm")}
              </p>
            </span>
          )}
          {/* 추가 기능 구현 예정 */}
          {/* <span
          className={`flex justify-center items-center rounded-full py-1 px-2.5 ${isChecked ? "bg-gray-200" : "bg-pai-300"}`}
        >
          <IoTimeOutline className={`w-4 h-4 mr-1 ${isChecked ? "text-gray-900" : "text-system-white"}`} />
          <p className={`text-xs ${isChecked ? "text-gray-700" : "text-system-white"}`}>priority</p>
        </span>
        <span
          className={`flex justify-center items-center rounded-full py-1 px-2.5 ${isChecked ? "bg-gray-200" : "bg-pai-300"}`}
        >
          <IoTimeOutline className={`w-4 h-4 mr-1 ${isChecked ? "text-gray-900" : "text-system-white"}`} />
          <p className={`text-xs ${isChecked ? "text-gray-700" : "text-system-white"}`}>group</p>
        </span> */}
        </div>
      </li>
    </>
  );
};

export default TodoCard;
