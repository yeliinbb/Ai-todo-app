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
      <div className="bg-fai-100 flex flex-col h-[calc(100vh-154px)]">
        <div className="bg-fai-100 h-1/2">
          <Calendar selectedDate={new Date(selectedDate)} onChange={handleDateChange} initialCollapsed={false} />
        </div>
        <div className="flex-grow overflow-auto bg-faiTrans-20060 rounded-t-[48px] h-1/2">
          <DiaryContent date={selectedDate} />
        </div>
      </div>
    </>
  );
};

export default DiaryListPage;
