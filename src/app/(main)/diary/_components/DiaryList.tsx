"use client";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import Calendar from "@/shared/ui/Calendar";

const DiaryListPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();

  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };
  return (
    <>
      <div className="bg-system-white">
        <Calendar selectedDate={new Date(selectedDate)} onChange={handleDateChange} initialCollapsed={false} />
        <DiaryContent date={selectedDate} />
      </div>
    </>
  );
};

export default DiaryListPage;
