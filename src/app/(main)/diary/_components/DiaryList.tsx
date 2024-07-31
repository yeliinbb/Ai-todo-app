"use client";
import { usePathname } from "next/navigation";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import Calendar from "@/shared/ui/Calendar";

const DiaryListPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
  const pathname = usePathname();

  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };
  console.log(selectedDate)
  return (
    <>
      <div className="bg-system-white">
        <Calendar selectedDate={new Date(selectedDate)} onChange={handleDateChange} />
        <DiaryContent date={selectedDate} />
      </div>
    </>
  );
};

export default DiaryListPage;
