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
    address: { lat: 0, lng: 0 }
  };

  return (
    <TodoForm
      initialData={initialData}
      onSubmit={(data) => {
        if (!data.title) return toast.warn("투두를 입력해주세요.");
        onSubmit?.(data);
      }}
      submitButtonText="추가하기"
    />
  );
};

export default AddTodoForm;
