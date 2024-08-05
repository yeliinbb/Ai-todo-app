import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import EditTodoForm from "./EditTodoForm";
import { Todo } from "../types";
import { useTodos } from "../useTodos";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useState } from "react";

interface DetailTodoDrawerProps {
  todo?: Todo;
  onClose?: () => void;
}
const DetailTodoDrawer = ({ todo, onClose }: DetailTodoDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateTodo } = useTodos();

  const handleSubmit = async (data: TodoFormData) => {
    if (todo == undefined) {
      return;
    }
    const eventDateTime = data.eventTime
      ? dayjs(todo.event_datetime).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : null;
    await updateTodo({
      todo_id: todo.todo_id,
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      address: data.address
    });
    onClose?.();
  };

  return (
    <Drawer open={todo !== undefined}>
      <DrawerContent onPointerDownOutside={onClose} className="h-[739px] rounded-t-[48px]">
        {todo ? (
          <>
            <DrawerHeader>
              <DrawerTitle className="text-gray-600 font-normal font-md">
                {dayjs(todo.event_datetime).format("YYYY년 M월 D일 ddd요일")}
              </DrawerTitle>
              <div className="absolute top-6 right-6">
                <IoCloseCircleOutline className="w-8 h-8 text-gray-400 cursor-pointer" onClick={() => setOpen(false)} />
              </div>
            </DrawerHeader>
            <EditTodoForm todo={todo} onSubmit={handleSubmit} />
          </>
        ) : (
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <div className="h-[100px]"></div>
          </DrawerHeader>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DetailTodoDrawer;
