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
      <div className="flex flex-col h-[calc(100vh-4.5rem)]">
        <div className="bg-fai-100">
          <Calendar selectedDate={new Date(selectedDate)} onChange={handleDateChange} initialCollapsed={false} />
        </div>
        <div className="bg-fai-100 flex flex-col h-full">
          <div className="flex-grow overflow-auto scrollbar-hide scroll-smooth bg-faiTrans-20060 rounded-t-[48px]">
            <DiaryContent date={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryListPage;
