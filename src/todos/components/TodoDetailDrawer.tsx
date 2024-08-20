import EditTodoForm from "./EditTodoForm";
import { Todo } from "../types";
import { useTodos } from "../useTodos";
import { useUserData } from "@/hooks/useUserData";
import TodoDrawer from "./TodoDrawer";
import dayjs from "dayjs";
import { TodoFormData } from "./TodoForm";
import ReadonlyTodoForm from "./ReadOnlyForm";
import useModal from "@/hooks/useModal";

interface TodoDetailDrawerProps {
  todo: Todo;
  open: boolean;
  onClose: () => void;
  editing: boolean;
  onChangeEditing: (editing: boolean) => void;
}

const TodoDetailDrawer = ({ open, todo, onClose, editing, onChangeEditing }: TodoDetailDrawerProps) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { deleteTodo, updateTodo } = useTodos(userId!);
  const deletionModal = useModal();

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

  const handleDeleteTodo = () => {
    deletionModal.openModal(
      {
        message: "삭제하시면 복구가 어렵습니다.\n정말 삭제하시겠습니까?",
        confirmButton: { text: "삭제", style: "삭제" }
      },
      () => deleteTodo(todo.todo_id)
    );
    onClose?.();
  };

  return (
    <>
      <deletionModal.Modal />
      <TodoDrawer
        open={open}
        onClose={onClose}
        selectedDate={new Date(todo?.event_datetime || Date.now())}
        className={`!transition-all !duration-300 !east-in-out ${editing ? "h-[calc(100svh-4.625rem)]" : "h-[65svh]"}`}
        modal={!(editing || deletionModal.isModalOpen)}
      >
        {editing ? (
          <EditTodoForm todo={todo!} onSubmit={handleSubmit} />
        ) : (
          <ReadonlyTodoForm todo={todo!} onClickEdit={() => onChangeEditing(true)} onClickDelete={handleDeleteTodo} />
        )}
      </TodoDrawer>
    </>
  );
};

export default TodoDetailDrawer;
