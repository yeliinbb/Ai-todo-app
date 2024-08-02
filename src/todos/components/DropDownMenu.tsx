import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@radix-ui/react-dropdown-menu";
import { Todo } from "../types";
import { TodoCardProps } from "./TodoCard";
import { useTodos } from "../useTodos";

const DropDownMenu = ({ todo, onClick }: TodoCardProps) => {
  const { deleteTodo } = useTodos();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">•••</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onClick(todo)}>수정</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deleteTodo(todo.todo_id)}>삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenu;
