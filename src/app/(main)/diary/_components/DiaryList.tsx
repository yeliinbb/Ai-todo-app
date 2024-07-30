"use client";
import { usePathname } from "next/navigation";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import Calendar from "@/shared/ui/Calendar";

const DiaryListPage: React.FC = () => {
  const { selectedDate } = useselectedCalendarStore();
  // const pathname = usePathname();
  return (
    <>
      {/* <Calendar pathname={pathname}/> */}
      <DiaryContent date={selectedDate} />
    </>
  );
};

export default DiaryListPage;
