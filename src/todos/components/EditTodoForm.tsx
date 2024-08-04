import { useState, useEffect } from "react";
import TimeSelect from "@/shared/TimeSelect";
import { Todo } from "../types";
import dayjs from "dayjs";
import { IoCheckmarkCircleOutline, IoLocationOutline, IoReaderOutline, IoTimeOutline } from "react-icons/io5";

export type EditTodoFormData = {
  title: string;
  description: string;
  eventTime: [number, number] | null;
  address: {
    lat: number;
    lng: number;
  } | null;
};

export interface EditTodoFormProps {
  todo: Todo;
  onSubmit?: (data: EditTodoFormData) => void;
}

const EditTodoForm = ({ todo, onSubmit }: EditTodoFormProps) => {
  const [formData, setFormData] = useState<EditTodoFormData>({
    title: todo.todo_title ?? "",
    description: todo.todo_description ?? "",
    eventTime: isoStringToTime(todo.event_datetime),
    address: todo.address as EditTodoFormData["address"]
  });

  useEffect(() => {
    setFormData({
      title: todo.todo_title ?? "",
      description: todo.todo_description ?? "",
      eventTime: isoStringToTime(todo.event_datetime),
      address: todo.address as EditTodoFormData["address"]
    });
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({
      title: "",
      description: "",
      eventTime: [0, 0],
      address: null
    });
  };

  return (
    <div className="relative flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md">
        <ul className="flex flex-col gap-4 w-full px-4">
          <li className="flex items-center border-b-gray-400 w-full h-8 justify-center">
            <IoCheckmarkCircleOutline className="text-pai-400 w-[18.3px] h-[18.3px] mr-3" />
            <input
              type="text"
              placeholder="제목을 입력해주세요."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="flex-1"
            />
          </li>
          <li className="flex items-center w-full h-8 justify-center">
            <IoReaderOutline className="w-5 h-5 text-gray-700 mr-3" />
            <input
              placeholder="메모"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="flex-1"
            />
          </li>
          <li className="flex items-center w-full h-8 justify-center">
            <IoTimeOutline className="w-5 h-5 text-gray-700 mr-3" />
            <div className="flex-1">
              <TimeSelect
                value={formData.eventTime ?? undefined}
                onChange={(value) => setFormData((prev) => ({ ...prev, eventTime: value ?? null }))}
              />
            </div>
          </li>
          <li className="flex items-center w-full h-8 justify-center">
            <IoLocationOutline className="w-5 h-5 text-gray-700 mr-3" />
            <button className="text-gray-400 flex-1 text-left">장소 선택</button>
          </li>
        </ul>
        <button
          type="submit"
          className="w-[calc(100%-32px)] h-11 bg-gray-200 text-system-white rounded-[24px] my-4 mx-auto"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default EditTodoForm;

function isoStringToTime(value: string | null): [number, number] | null {
  if (value == null) {
    return null;
  }
  const date = new Date(value);
  return [date.getHours(), date.getMinutes()];
}
