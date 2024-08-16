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
  // [calc(100%-4.5rem-76px)]
  return (
    <>
      {/* <div className="flex flex-col bg-system-white box-border relative top-[4.5rem] h-[calc(100vh-72px)]"> */}
      <div className="grid grid-rows-[auto_1fr] bg-system-white box-border relative top-[4.5rem] h-[calc(100vh-72px)] overflow-hidden">
        <Calendar
          selectedDate={new Date(selectedDate)}
          onChange={handleDateChange}
          initialCollapsed={false}
          color="fai"
        />
        {/* <div className="bg-system-red200 h-[calc(100vh-27.8rem)]"> */}
        <div className=" bg-system-white">
          <div className="h-full overflow-y-auto border-2 border-fai-400 scrollbar-hide scroll-smooth bg-faiTrans-20060 rounded-t-[48px] box-border">
            <DiaryContent date={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryListPage;
