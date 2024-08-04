import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import EditTodoForm from "./EditTodoForm";
import { Todo } from "../types";
import { useTodos } from "../useTodos";

interface DetailTodoDrawerProps {
  todo?: Todo;
  onClose?: () => void;
}
const DetailTodoDrawer = ({ todo, onClose }: DetailTodoDrawerProps) => {
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
      {/* <AddTodoBtn onClick={() => setOpen(true)} /> */}
      {/* 여기에 TodoCard 컴포넌트 내의 DropdownMenuItem 수정을 클릭했을 때 이동되는 */}

      <DrawerContent onPointerDownOutside={onClose}>
        {todo ? (
          <>
            <DrawerHeader>
              <DrawerTitle>{dayjs(todo.event_datetime).format("YYYY년 M월 D일 ddd요일")}</DrawerTitle>
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
