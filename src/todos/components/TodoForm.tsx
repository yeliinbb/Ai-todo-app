"use client";

import { IoCheckmarkCircleOutline, IoLocationOutline, IoReaderOutline, IoTimeOutline } from "react-icons/io5";
import TimeSelect from "@/shared/TimeSelect";
import LocationSelect from "@/shared/LocationSelect";
import { useForm, Controller } from "react-hook-form";
import { LocationData } from "@/shared/LocationSelect/types";
import { ReactNode } from "react";

export type TodoFormData = {
  title: string;
  description: string;
  eventTime: [number, number] | null;
  address?: LocationData;
};

export interface TodoFormProps {
  initialData: TodoFormData;
  onSubmit: (data: TodoFormData) => void;
  isReadonly: boolean;
  footer?: ReactNode;
}

const TodoForm = ({ initialData, onSubmit, isReadonly, footer }: TodoFormProps) => {
  // const [formData, setFormData] = useState<TodoFormData>(initialData);
  const {
    handleSubmit, // form onSubmit에 들어가는 함수
    register, // onChange 등의 이벤트 객체 생성
    watch, // register를 통해 받은 모든 값 확인
    control, // Controller
    formState
  } = useForm<TodoFormData>({ defaultValues: initialData, mode: "onChange" });

  // const titleRef = useAutoResizeTextarea(formData.title);
  // const descriptionRef = useAutoResizeTextarea(formData.description);

  // const handleSubmitFormData = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  //   setFormData({
  //     title: "",
  //     description: "",
  //     eventTime: null,
  //     address: { lat: 0, lng: 0 }
  //   });
  // };

  return (
    <div className="relative flex flex-col items-center flex-1">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full max-w-md h-full">
        <div className="flex items-center border-b border-gray-400 w-full p-1 py-2 mb-7 justify-center">
          <IoCheckmarkCircleOutline className="text-pai-400 w-[22px] h-[22px]" />
          <textarea
            // {...register("title", {
            //   required: { value: true, message: "제목을 입력해주세요." },
            //   minLength: {
            //     value: 1,
            //     message: "제목을 입력해주세요."
            //   }
            // })}
            {...register("title", {
              required: "제목을 입력해주세요!",
              minLength: { value: 1, message: "제목을 입력해주세요!" }
            })}
            disabled={isReadonly || formState.isSubmitting}
            // ref={titleRef}
            rows={1}
            placeholder="제목을 입력해주세요."
            // value={formData.title}
            // onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="flex-1 ml-[10px] text-xl outline-none overflow-y-hidden resize-none max-h-40"
          />
        </div>
        <ul className="flex flex-col gap-6 w-full flex-1">
          <li className="flex items-center w-full h-auto min-h-8 justify-center focus-within:bg-grayTrans-20032">
            <IoReaderOutline className="w-5 h-5 text-gray-700" />
            <textarea
              {...register("description")}
              disabled={isReadonly || formState.isSubmitting}
              // ref={descriptionRef}
              rows={1}
              placeholder="메모"
              // value={formData.description}
              // onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="flex-1 ml-[12px] outline-none overflow-y-hidden resize-none max-h-40"
              style={{ background: "transparent" }} // bg-transparent 적용이 되지 않아 임시 사용
            />
          </li>
          <li className="flex items-center w-full h-8 justify-center">
            <IoTimeOutline className="w-5 h-5 text-gray-700" />
            <div className="flex-1 ml-[12px]">
              <Controller
                control={control}
                name="eventTime"
                render={({ field }) => (
                  <TimeSelect
                    {...field}
                    value={field.value ?? undefined}
                    onChange={(value) => field.onChange(value ?? null)}
                    // value={formData.eventTime ?? undefined}
                    // onChange={(value) => setFormData((prev) => ({ ...prev, eventTime: value ?? null }
                    disabled={isReadonly || formState.isSubmitting}
                  />
                )}
              />
            </div>
          </li>
          <li className="flex items-center w-full h-8 justify-center active:bg-grayTrans-20032">
            <IoLocationOutline className="w-5 h-5 text-gray-700" />
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <LocationSelect
                  {...field}
                  value={field.value}
                  disabled={isReadonly || formState.isSubmitting}
                  placeholder="장소 선택"
                  className="flex-1 ml-[12px]"
                />
              )}
            />
          </li>
        </ul>
        {footer && footer}
      </form>
    </div>
  );
};

export default TodoForm;
