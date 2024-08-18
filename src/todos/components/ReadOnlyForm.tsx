import TodoForm, { TodoFormData } from "./TodoForm";
import { Todo } from "../types";
import { isoStringToTime } from "@/shared/utils";
import { Button } from "@/shared/ui/button";

export interface ReadonlyTodoFormProps {
  todo: Todo;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
}

const ReadonlyTodoForm = ({ todo, onClickDelete, onClickEdit }: ReadonlyTodoFormProps) => {
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
      isReadonly={true}
      onSubmit={() => {}}
      footer={
        <div className="flex items-center gap-[1.0625rem] flex-shrink-0 w-[21.4375rem] min-w-[21.47375rem] x-[1rem] mt-[1.25rem] mb-0">
          <Button type="button" variant="PAI" size="default" className="w-full" onClick={onClickEdit}>
            수정
          </Button>
          <Button type="button" variant="systemRed" size="default" className="w-full" onClick={onClickDelete}>
            삭제
          </Button>
        </div>
      }
    />
  );
};

export default ReadonlyTodoForm;
