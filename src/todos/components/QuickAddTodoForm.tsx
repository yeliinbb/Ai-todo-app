import { useState } from "react";
import { TodoFormData } from "./AddTodoForm";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

export interface QuickAddTodoFormProps {
  onSubmit?: (data: TodoFormData) => void;
}

const QuickAddTodoForm = ({ onSubmit }: QuickAddTodoFormProps) => {
  const [formTitle, setFormTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: TodoFormData = {
      title: formTitle,
      description: "",
      eventTime: [0, 0],
      address: null
    };
    onSubmit?.(newTodo);
    setFormTitle("");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center border border-pai-100 border-solid rounded-[32px] bg-whiteTrans-wh72 w-full h-[76px] p-4 mb-6"
      >
        <IoIosAddCircleOutline type="submit" className="w-9 h-9 text-gray-700" />
        <input
          type="text"
          placeholder="투두리스트를 작성해보세요."
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          autoFocus
          className="outline-none p-2 flex-1 placeholder-gray-400"
        />
      </form>
    </div>
  );
};

export default QuickAddTodoForm;
