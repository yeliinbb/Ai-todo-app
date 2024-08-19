import useModal from "@/hooks/useModal";
import { TodoFormData } from "./components/TodoForm";
import { useTodos } from "./useTodos";
import { useUserData } from "@/hooks/useUserData";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export const useAddTodo = (selectedDate: Date) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { addTodo } = useTodos(userId!);
  const router = useRouter();
  const { openModal } = useModal();

  const handleCheckLogin = () => {
    openModal(
      {
        message: "로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동합니다.",
        confirmButton: { text: "확인", style: "시스템" }
      },
      () => router.push("/login")
    );
  };

  const handleAuthRequire = () => {
    if (!userId) {
      handleCheckLogin();
    }
  };

  const handleAddTodoSubmit = async (data: TodoFormData): Promise<void> => {
    handleAuthRequire();

    const eventDateTime = data.eventTime
      ? dayjs(selectedDate).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : dayjs(selectedDate).set("hour", 0).set("minute", 0).toISOString();

    await addTodo({
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      is_chat: false,
      is_all_day_event: data.eventTime === null
    });
  };

  return { handleAddTodoSubmit };
};
