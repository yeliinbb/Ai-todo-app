import { Button } from "@/shared/ui/button";
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
        <Button type="submit" variant="PAI" size="default" className="w-full">
          완료
        </Button>
      }
    />
  );
};

export default AddTodoForm;
