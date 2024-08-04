import { useState } from "react";
import TimeSelect from "@/shared/TimeSelect";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

export type TodoFormData = {
  title: string;
  description: string;
  eventTime: [number, number] | null;
  address: {
    lat: number;
    lng: number;
  } | null;
};
export interface AddTodoFormProps {
  onSubmit?: (data: TodoFormData) => void;
}

const AddTodoForm = ({ onSubmit }: AddTodoFormProps) => {
  const [formData, setFormData] = useState<TodoFormData>({
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
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <Input
              type="text"
              placeholder="제목을 입력해주세요."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </li>
          <li>
            <Textarea
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
        <Button type="submit">추가하기</Button>
      </form>
    </div>
  );
};

export default AddTodoForm;
