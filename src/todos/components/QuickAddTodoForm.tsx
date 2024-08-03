import { useState } from "react";
import { AddTodoFormData } from "./AddTodoForm";
import { IoIosAddCircleOutline } from "react-icons/io";

export interface QuickAddTodoFormProps {
  onSubmit?: (data: AddTodoFormData) => void;
}

const QuickAddTodoForm = ({ onSubmit }: QuickAddTodoFormProps) => {
  const [formTitle, setFormTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: AddTodoFormData = {
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
        className="flex items-center border border-pai-100 border-solid rounded-[32px] bg-whiteTrans-wh72 p-4 mb-6"
      >
        <IoIosAddCircleOutline type="submit" className="w-[36px] h-[36px] text-gray-700" />
        <input
          type="text"
          placeholder="투두리스트를 작성해보세요."
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          autoFocus
          className="outline-none p-2 w-[343px] h-[76p] placeholder-gray-400"
        />
      </form>
    </div>
  );
};

export default QuickAddTodoForm;
