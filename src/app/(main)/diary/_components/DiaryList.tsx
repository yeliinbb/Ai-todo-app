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
      <div className="h-full pt-[4.5rem] bg-gray-100">
        <Calendar selectedDate={new Date(selectedDate)} onChange={handleDateChange} initialCollapsed={false} />
        <div className="bg-gray-100 flex flex-col h-full">
          <div className="flex-grow overflow-y-auto scrollbar-hide scroll-smooth bg-faiTrans-20060 rounded-t-[48px]">
            <DiaryContent date={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryListPage;
