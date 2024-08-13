import EditTodoForm from "./EditTodoForm";
import { Todo } from "../types";
import { useTodos } from "../useTodos";
import { useUserData } from "@/hooks/useUserData";
import TodoDrawer from "./TodoDrawer";
import dayjs from "dayjs";
import { TodoFormData } from "./TodoForm";

interface EditTodoDrawerProps {
  todo?: Todo;
  onClose?: () => void;
}

const EditTodoDrawer = ({ todo, onClose }: EditTodoDrawerProps) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { updateTodo } = useTodos(userId!);

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
    <TodoDrawer
      open={todo !== undefined}
      onClose={onClose!}
      selectedDate={new Date(todo?.event_datetime || Date.now())}
    >
      <EditTodoForm todo={todo!} onSubmit={handleSubmit} />
    </TodoDrawer>
  );
};

export default EditTodoDrawer;
