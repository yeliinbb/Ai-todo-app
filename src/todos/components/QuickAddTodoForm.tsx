"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { TodoFormData } from "./TodoForm";
import { SendIcon } from "lucide-react";
import Plus from "@/components/icons/Plus";
import Check from "@/components/icons/todo-list/Check";

export interface QuickAddTodoFormProps {
  onSubmit?: (data: TodoFormData) => void;
}

const QuickAddTodoForm = ({ onSubmit }: QuickAddTodoFormProps) => {
  const [formTitle, setFormTitle] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return alert("투두를 입력해주세요");
    // toast.warn("투두를 입력해주세요.");
    const newTodo: TodoFormData = {
      title: formTitle,
      description: "",
      eventTime: null,
      address: undefined
    };
    onSubmit?.(newTodo);

    inputRef?.current?.blur();
    setFormTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center justify-between w-full px-[1.25rem] py-[1rem] rounded-full bg-system-white border border-pai-200
      ${
        // 포커스 여부에 따른 border 색상 변경
        isFocused ? "border-pai-400" : "border-pai-200"
      }`}
    >
      <div className="flex items-center">
        <div className="w-[1.25rem] h-[1.25rem] mr-[0.75rem]">
          {formTitle ? (
            // 텍스트가 입력된 상태
            <Check
              className={`w-[1.25rem] h-[1.25rem] text-gray-600
        ${
          // 텍스트 입력 여부에 따른 아이콘 색상 변경
          formTitle ? "text-pai-400" : "text-gray-600"
        }`}
            />
          ) : (
            // 텍스트가 빈 상태
            <Plus
              className={`w-[1.25rem] h-[1.25rem] text-gray-600
        ${
          // 텍스트 입력 여부에 따른 아이콘 색상 변경
          formTitle ? "text-pai-400" : "text-gray-600"
        }`}
            />
          )}
        </div>

        <input
          type="text"
          placeholder="투두리스트를 추가해보세요"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)} // 입력 필드 값 변경 시 상태 업데이트
          onFocus={() => setIsFocused(true)} // 입력 필드 포커스 시 상태 변경
          onBlur={() => setIsFocused(false)} // 포커스 해제 시 상태 변경
          className={`outline-none placeholder-gray-400 text-center w-[11.938rem] ${
            // 텍스트 입력 여부에 따른 텍스트 색상 변경
            formTitle ? "text-gray-900" : "text-gray-400"
          }`}
          ref={inputRef}
        />
      </div>
      {/* {isFocused && formTitle (
        // 입력 중 & 텍스트가 입력된 상태 */}
      <button type="submit" className="w-[1.25rem] h-[1.25rem]">
        <SendIcon className="w-[1.25rem] h-[1.25rem] text-gray-400 active:text-gray-600" />
      </button>
      {/* <button type="button" onClick={() => toast.error("엥")}>
        테스트
      </button> */}
      {/* )} */}
    </form>
  );
};

export default QuickAddTodoForm;
