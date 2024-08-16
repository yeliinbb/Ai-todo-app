import TodoForm, { TodoFormData } from "./TodoForm";
import { toast } from "react-toastify";

export interface AddTodoFormProps {
  onSubmit?: (data: TodoFormData) => void;
}

const AddTodoForm = ({ onSubmit }: AddTodoFormProps) => {
  const initialData: TodoFormData = {
    title: "",
    description: "",
    eventTime: null,
    address: undefined
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
        <button type="submit" className="w-full px-6 py-[6px] bg-pai-400 text-system-white rounded-[24px]">
          완료
        </button>
      }
    />
  );
};

export default AddTodoForm;
