import TodoForm, { TodoFormData } from "./TodoForm";
import { Todo } from "../types";
import { isoStringToTime } from "@/shared/utils";
import { Button } from "@/shared/ui/button";

export interface EditTodoFormProps {
  todo: Todo;
  onSubmit?: (data: TodoFormData) => void;
}

const EditTodoForm = ({ todo, onSubmit }: EditTodoFormProps) => {
  if (!todo) {
    return null; // 스켈레톤 UI 넣기
  }

  const initialData: TodoFormData = {
    title: todo.todo_title ?? "",
    description: todo.todo_description ?? "",
    eventTime: todo.is_all_day_event ? null : isoStringToTime(todo.event_datetime),
    address: todo.address as TodoFormData["address"]
  };

  return (
    <TodoForm
      initialData={initialData}
      onSubmit={(data) => {
        // if (!data.title) return toast.warn("투두를 입력해주세요.");
        onSubmit?.(data);
      }}
      isReadonly={false}
      footer={
        <Button type="submit" variant="PAI" size="default" className="w-full">
          수정
        </Button>
      }
    />
  );
};

export default EditTodoForm;
