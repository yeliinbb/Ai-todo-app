"use client";

import Calendar from "../../_components/Calendar";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

const DiaryListPage = () => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  return (
    <>
      <Calendar handleDateSelect={handleDateSelect} />
      {selectedDate && <DiaryContent date={selectedDate} />}
    </>
  );
};

export default DiaryListPage;
