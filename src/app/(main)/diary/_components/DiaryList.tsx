"use client";
import { usePathname } from "next/navigation";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import Calendar from "../../_components/Calendar";

const DiaryListPage: React.FC = () => {
  const { selectedDate } = useselectedCalendarStore();
  console.log(selectedDate)
  const pathname = usePathname();
  return (
    <>
      <Calendar pathname={pathname}/>
      <DiaryContent date={selectedDate} />
    </>
  );
};

export default DiaryListPage;
