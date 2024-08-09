import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@radix-ui/react-dropdown-menu";
import { TodoCardProps } from "./TodoCard";
import { useTodos } from "../useTodos";
import { IoIosMore } from "react-icons/io";
import { useUserData } from "@/hooks/useUserData";

interface CheckedTodoCardProps extends TodoCardProps {
  isChecked: boolean;
}

const DropDownMenuBtn = ({ todo, onClick, isChecked }: CheckedTodoCardProps) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { deleteTodo } = useTodos(userId!);

  return (
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
        <DropdownMenuItem onClick={() => deleteTodo(todo.todo_id)}>삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuBtn;
