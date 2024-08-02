import { useState, useEffect } from "react";
import TimeSelect from "@/shared/TimeSelect";
import { Todo } from "../types";
import dayjs from "dayjs";

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
  selectedDate: Date;
}

const EditTodoForm = ({ todo, onSubmit, selectedDate }: EditTodoFormProps) => {
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
    console.log(formData);
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
    <div>
      <div>{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</div>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <input
              type="text"
              placeholder="제목을 입력해주세요."
              value={formData?.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </li>
          <li>
            <textarea
              placeholder="메모"
              value={formData?.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </li>
          <li>
            <TimeSelect
              value={formData?.eventTime ?? undefined}
              onChange={(value) => setFormData((prev) => ({ ...prev, eventTime: value ?? null }))}
            />
          </li>
          <li>
            <span>장소 선택</span>
          </li>
          {/* <li>
            <span>5분 전</span>
            <span>10분 전</span>
            <span>15분 전</span>
            <span>30분 전</span>
          </li> */}
        </ul>
        <button type="submit">수정하기</button>
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
