"use client";

import { useState } from "react";
import { IoCheckmarkCircleOutline, IoLocationOutline, IoReaderOutline, IoTimeOutline } from "react-icons/io5";
import TimeSelect from "@/shared/TimeSelect";
import LocationSelect from "@/shared/LocationSelect";
import useAutoResizeTextarea from "@/shared/useAutoResizeTextArea";
import { toast } from "react-toastify";

export type TodoFormData = {
  title: string;
  description: string;
  eventTime: [number, number] | null;
  address: {
    lat: number;
    lng: number;
  } | null;
};

export interface TodoFormProps {
  initialData: TodoFormData;
  onSubmit: (data: TodoFormData) => void;
  submitButtonText: string;
}

const TodoForm = ({ initialData, onSubmit, submitButtonText }: TodoFormProps) => {
  const [formData, setFormData] = useState<TodoFormData>(initialData);

  const titleRef = useAutoResizeTextarea(formData.title);
  const descriptionRef = useAutoResizeTextarea(formData.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.warn("투두를 입력해주세요.");
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      eventTime: null,
      address: { lat: 0, lng: 0 }
    });
  };

  return (
    <div className="relative flex flex-col items-center flex-1">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md h-full">
        <div className="flex items-center border-b border-gray-400 w-full p-1 py-2 mb-7 justify-center">
          <IoCheckmarkCircleOutline className="text-pai-400 w-[22px] h-[22px]" />
          <textarea
            ref={titleRef}
            rows={1}
            placeholder="제목을 입력해주세요."
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="flex-1 ml-[10px] text-xl outline-none overflow-y-hidden resize-none max-h-40"
          />
        </div>
        <ul className="flex flex-col gap-6 w-full flex-1">
          <li className="flex items-center w-full h-auto min-h-8 justify-center focus-within:bg-grayTrans-20032">
            <IoReaderOutline className="w-5 h-5 text-gray-700" />
            <textarea
              ref={descriptionRef}
              rows={1}
              placeholder="메모"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="flex-1 ml-[12px] outline-none overflow-y-hidden resize-none max-h-40"
              style={{ background: "transparent" }} // bg-transparent 적용이 되지 않아 임시 사용
            />
          </li>
          <li className="flex items-center w-full h-8 justify-center">
            <IoTimeOutline className="w-5 h-5 text-gray-700" />
            <div className="flex-1 ml-[12px]">
              <TimeSelect
                value={formData.eventTime ?? undefined}
                onChange={(value) => setFormData((prev) => ({ ...prev, eventTime: value ?? null }))}
              />
            </div>
          </li>
          <li className="flex items-center w-full h-8 justify-center active:bg-grayTrans-20032">
            <IoLocationOutline className="w-5 h-5 text-gray-700" />
            <LocationSelect placeholder="장소 선택" className="flex-1 ml-[12px]" />
          </li>
        </ul>
        <button type="submit" className="w-full px-6 py-[6px] bg-pai-400 text-system-white rounded-[24px]">
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
