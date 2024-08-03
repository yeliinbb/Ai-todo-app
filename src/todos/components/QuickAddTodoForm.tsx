import { useState } from "react";
import { useTodos } from "../useTodos";
import { Todo } from "../types";
import { AddTodoFormData } from "./AddTodoForm";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

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
    <form onSubmit={handleSubmit}>
      <Button type="submit">+</Button>
      <Input
        type="text"
        placeholder="새로운 할 일을 입력하세요."
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        autoFocus
      />
    </form>
  );
};

export default QuickAddTodoForm;
