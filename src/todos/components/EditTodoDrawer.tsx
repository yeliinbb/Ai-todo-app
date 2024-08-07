import { Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import EditTodoForm from "./EditTodoForm";
import { Todo } from "../types";
import { useTodos } from "../useTodos";

interface EditTodoDrawerProps {
  todo?: Todo;
  onClose?: () => void;
}
const EditTodoDrawer = ({ todo, onClose }: EditTodoDrawerProps) => {
  const { updateTodo } = useTodos();

  const handleSubmit = async (data: TodoFormData) => {
    if (todo == undefined) {
      return;
    }
    const eventDateTime = data.eventTime
      ? dayjs(todo.event_datetime).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : dayjs(todo.event_datetime).set("hour", 0).set("minute", 0).toISOString();
    await updateTodo({
      todo_id: todo.todo_id,
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      address: data.address,
      is_all_day_event: data.eventTime === null
    });
    onClose?.();
  };

  return (
    <Drawer open={todo !== undefined} onClose={onClose}>
      <DrawerContent onPointerDownOutside={onClose} className="h-[calc(100svh-1rem)]">
        {todo ? (
          <>
            <DrawerHeader className="relative">
              <DrawerTitle>{dayjs(todo.event_datetime).format("YYYY년 M월 D일 ddd요일")}</DrawerTitle>
              <DrawerCloseButton onClick={onClose} />
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

export default EditTodoDrawer;
