import TodoForm, { TodoFormData } from "./TodoForm";
import { Todo } from "../types";
import { isoStringToTime } from "@/shared/utils";

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
          <button
            type="button"
            className="w-full px-6 py-[6px] bg-pai-400 text-system-white rounded-[24px]"
            onClick={onClickEdit}
          >
            수정
          </button>
          <button
            type="button"
            className="w-full px-6 py-[6px] bg-system-red200 text-system-white rounded-[24px]"
            onClick={onClickDelete}
          >
            삭제
          </button>
        </div>
      }
    />
  );
};

export default ReadonlyTodoForm;
