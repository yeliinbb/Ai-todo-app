"use client";
import { usePathname } from "next/navigation";
import TodoList from "../../todo-list/_components/TodoList";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

const DiaryListPage: React.FC = () => {
  const { selectedDate } = useselectedCalendarStore();
  const pathname = usePathname();
  return (
    <>
      <TodoList pathname={pathname} />
      <DiaryContent date={selectedDate} />
    </>
  );
};

export default DiaryListPage;
