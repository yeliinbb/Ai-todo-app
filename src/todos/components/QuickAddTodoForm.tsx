import { useState } from "react";
import { useTodos } from "../useTodos";
import { Todo } from "../types";
import { AddTodoFormData } from "./AddTodoForm";

export interface QuickAddTodoFormProps {
  onSubmit?: (data: AddTodoFormData) => void;
}

const QuickAddTodoForm = ({ onSubmit }: QuickAddTodoFormProps) => {
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: AddTodoFormData = {
      title: title,
      description: "",
      eventTime: [0, 0],
      address: null
    };
    onSubmit?.(newTodo);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">+</button>
      <input
        type="text"
        placeholder="새로운 할 일을 입력하세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
};

export default QuickAddTodoForm;
