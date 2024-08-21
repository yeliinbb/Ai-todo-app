"use client";

import { useRef, useState } from "react";
import { TodoFormData } from "./TodoForm";
import { SendIcon } from "lucide-react";
import Plus from "@/components/icons/Plus";
import Check from "@/components/icons/todo-list/Check";
import { useUserData } from "@/hooks/useUserData";
import useModal from "@/hooks/useModal";
import { Todo } from "../types";
import { useRouter } from "next/navigation";

export interface QuickAddTodoFormProps {
  onSubmit?: (data: TodoFormData) => void;
}

const QuickAddTodoForm = ({ onSubmit }: QuickAddTodoFormProps) => {
  const [formTitle, setFormTitle] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useUserData();
  const userId = data?.user_id;
  const { openModal, Modal } = useModal();
  const router = useRouter();

  const handleCheckLogin = (e: React.MouseEvent<HTMLFormElement>) => {
    if (!userId) {
      e.preventDefault();
      openModal(
        {
          message: "로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동합니다.",
          confirmButton: { text: "확인", style: "시스템" }
        },
        () => router.push("/login")
      );
    }
  };
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
    <>
      <Modal />
      <form
        onSubmit={handleSubmit}
        onClick={handleCheckLogin}
        className={`flex items-center w-full px-[1.25rem] py-[1rem] rounded-full bg-system-white border border-pai-200
        ${
          // 포커스 여부에 따른 border 색상 변경
          isFocused ? "border-pai-400" : "border-pai-200"
        }`}
      >
        {formTitle ? (
          // 텍스트가 입력된 상태
          <Check
            className={`w-[1.25rem] h-[1.25rem] mr-[0.75rem] text-gray-600
          ${
            // 텍스트 입력 여부에 따른 아이콘 색상 변경
            formTitle ? "text-pai-400" : "text-gray-600"
          }`}
          />
        ) : (
          // 텍스트가 빈 상태
          <Plus
            className={`w-[1.25rem] h-[1.25rem] mr-[0.75rem] text-gray-600
          ${
            // 텍스트 입력 여부에 따른 아이콘 색상 변경
            formTitle ? "text-pai-400" : "text-gray-600"
          }`}
          />
        )}
        <input
          type="text"
          placeholder="투두리스트를 추가해보세요"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)} // 입력 필드 값 변경 시 상태 업데이트
          onFocus={() => setIsFocused(true)} // 입력 필드 포커스 시 상태 변경
          onBlur={() => setIsFocused(false)} // 포커스 해제 시 상태 변경
          className={`text-bc4 outline-none flex-1 placeholder-gray-400 ${
            // 텍스트 입력 여부에 따른 텍스트 색상 변경
            formTitle ? "text-gray-900" : "text-gray-400"
          }`}
          ref={inputRef}
        />
        {/* {isFocused && formTitle (
          // 입력 중 & 텍스트가 입력된 상태 */}
        <button type="submit">
          <SendIcon className="w-[1.25rem h-[1.25rem] text-gray-400 active:text-gray-600" />
        </button>
        {/* )} */}
      </form>
    </>
  );
};

export default QuickAddTodoForm;
