"use client";

import dayjs from "dayjs";
import { Todo } from "../types";
import { useTodos } from "../useTodos";
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
import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import TodoDetailDrawer from "./TodoDetailDrawer";
import TimeIcon from "@/components/icons/todo-list/TimeIcon";
import PlaceIcon from "@/components/icons/todo-list/PlaceIcon";
import { getFormattedAddress } from "../getFormattedAddress";
import { LocationData } from "@/shared/LocationSelect/types";
import { Button } from "@/shared/ui/button";
import Check from "@/components/icons/todo-list/Check";

export interface TodoCardProps {
  todo: Todo;
}

const TodoCard = ({ todo }: TodoCardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDrawerEditing, setIsDrawerEditing] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(todo.is_done ?? false);
  const { data } = useUserData();
  const userId = data?.user_id;
  const { updateTodo, deleteTodo } = useTodos(userId!);
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

  const handleOpenDrawer = (editing: boolean) => {
    setDrawerOpen(true);
    setIsDrawerEditing(editing);
  };

  return (
    <>
      <Modal />
      <li
        onClick={() => handleOpenDrawer(false)}
        className={`cursor-pointer flex flex-col p-4 gap-4 self-stretch border border-solid rounded-[2rem] ${isChecked ? "border-gray-200 bg-gray-100" : "border-pai-200 bg-system-white"}`}
      >
        <div className="flex items-center gap-3 self-stretch flex-1">
          <div className="flex items-center gap-1 pt-1">
            <label htmlFor={todo.todo_id} className="select-none" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                id={todo.todo_id}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="hidden"
              />
              {isChecked ? (
                <Button
                  variant={"linedPAI"}
                  className="w-9 h-9 p-[0.35rem] rounded-full border-[0.06rem] bg-pai-400 hover:bg-pai-300"
                  onClick={handleCheckboxChange}
                >
                  <Check className="w-[2.25rem] h-[2.25rem] text-system-white" />
                </Button>
              ) : (
                <Button
                  variant={"linedPAI"}
                  className="w-9 h-9 p-[0.35rem] rounded-full border-[0.06rem] border-pai-200 hover:bg-pai-100"
                  onClick={handleCheckboxChange}
                >
                  <Check className="w-[2.25rem] h-[2.25rem] text-pai-200" />
                </Button>
              )}
            </label>
          </div>
          <div className="flex flex-1 items-center justify-between min-w-0">
            <div
              className={`flex flex-col self-stretch w-[207px] min-w-0 justify-center flex-1 ${todo.todo_description ?? ""}`}
            >
              <p className="text-sh5 text-gray-800 truncate w-full">{todo.todo_title}</p>
              {todo.todo_description && (
                <p className={`text-bc5 ${isChecked ? "text-gray-400" : "text-gray-600"} truncate w-full`}>
                  {todo.todo_description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant={"linedGrayScale"}
                  className={`w-9 h-9 p-0 rounded-full ${isChecked ? "border-gray-700 hover:bg-gray-200" : "border-gray-200 hover:bg-gray-100"}`}
                >
                  <IoIosMore className="w-5 h-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[5rem] min-w-[9.06rem] rounded-b-[0.75rem]"
                side="left"
                align="end"
                sideOffset={8} // 트리거 버튼과 메뉴 세로 px 간격 조정
                alignOffset={-58} // 트리거 버튼과 메뉴 가로 px 간격 조정
              >
                <DropdownMenuItem
                  // onClick={() => onClick(todo)}
                  onClick={(e) => {
                    handleOpenDrawer(true);
                    e.stopPropagation();
                  }}
                  className="flex items-center self-stretch gap-[10px] px-3 py-2 border-b-grayTrans-20060 border-solid"
                >
                  <FaPen />
                  <p className="text-pai-400">수정</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo();
                  }}
                  className="flex items-center self-stretch gap-[10px] px-3 py-2"
                >
                  <FaRegTrashAlt className="text-system-red200" />
                  <p className="text-system-red200">삭제</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {(!todo.is_all_day_event && todo.event_datetime) || todo.address ? (
          <div className="flex justify-end items-start gap-1.5">
            {/* 뱃지 컴포넌트 분리 */}
            {!todo.is_all_day_event && todo.event_datetime && (
              <span
                className={`flex justify-center items-center gap-[0.25rem] px-[0.75rem] py-0 rounded-full ${isChecked ? "bg-gray-200" : "bg-pai-300"}`}
              >
                <TimeIcon className={`w-[0.75rem] h-[0.75rem] ${isChecked ? "text-gray-900" : "text-system-white"}`} />
                <p
                  className={`text-bc6 truncate max-w-[4.5625rem] ${isChecked ? "text-gray-700" : "text-system-white"}`}
                >
                  {dayjs(todo.event_datetime).format("HH:mm")}
                </p>
              </span>
            )}
            {todo.address && (
              <span
                className={`flex justify-center items-center gap-[0.25rem] px-[0.75rem] py-0 rounded-full ${isChecked ? "bg-gray-200" : "bg-pai-300"}`}
              >
                <PlaceIcon className={`w-[0.75rem] h-[0.75rem] ${isChecked ? "text-gray-900" : "text-system-white"}`} />
                <p
                  className={`text-bc6 truncate max-w-[4.5625rem] ${isChecked ? "text-gray-700" : "text-system-white"}`}
                >
                  {getFormattedAddress(todo.address as LocationData)}
                </p>
              </span>
            )}
          </div>
        ) : (
          <div className="hidden gap-1.5"></div>
        )}
      </li>
      <TodoDetailDrawer
        todo={todo}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editing={isDrawerEditing}
        onChangeEditing={(v) => setIsDrawerEditing(v)}
      />
    </>
  );
};

export default TodoCard;
