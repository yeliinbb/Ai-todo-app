import { useState } from "react";
import TimeSelect from "@/shared/TimeSelect";
import dayjs from "dayjs";
import { addTodoAddress } from "@/lib/utils/todos/AddTodoAddress";

export type AddTodoFormData = {
  title: string;
  description: string;
  eventTime: [number, number] | null;
  address: {
    lat: number;
    lng: number;
  } | null;
};
export interface AddTodoFormProps {
  onSubmit?: (data: AddTodoFormData) => void;
  selectedDate: Date;
}

const AddTodoForm = ({ onSubmit, selectedDate }: AddTodoFormProps) => {
  const [formData, setFormData] = useState<AddTodoFormData>({
    title: "",
    description: "",
    eventTime: [0, 0],
    address: null
  });

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
    <div>
      <div>{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</div>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <input
              type="text"
              placeholder="제목을 입력해주세요."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </li>
          <li>
            <textarea
              placeholder="메모"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </li>
          <li>
            <TimeSelect
              value={formData.eventTime ?? undefined}
              onChange={(value) => setFormData((prev) => ({ ...prev, eventTime: value ?? null }))}
            />
          </li>
          <li>{/* <span onClick={() =>  }>장소 선택</span> */}</li>
          {/* <li>
            <span>5분 전</span>
            <span>10분 전</span>
            <span>15분 전</span>
            <span>30분 전</span>
          </li> */}
        </ul>
        <button type="submit">추가하기</button>
      </form>
    </div>
  );
};

export default AddTodoForm;
