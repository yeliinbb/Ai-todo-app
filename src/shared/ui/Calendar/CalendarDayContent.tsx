import { HTMLAttributes, useMemo } from "react";
import { CalendarEvent } from ".";
import dayjs from "dayjs";

interface CalendarDayContentProps {
  day: number;
  date: dayjs.Dayjs;
  events: CalendarEvent[];
  isToday?: boolean;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
}

const CalendarDayContent = ({ day, date, events, isToday, isCurrentMonth, isSelected }: CalendarDayContentProps) => {
  const eventsInDay = useMemo(() => {
    return events?.filter((event) => dayjs(event.date).isSame(date, "day")) ?? [];
  }, [events, date]);

  const colorClassNames = useMemo(() => {
    // 투두가 있을 때
    if (eventsInDay.length > 0) {
      // 모두 완료
      if (eventsInDay.every((e) => e.done)) {
        return "bg-pai-400 text-white";
      }
      // 미완료
      return "bg-pai-200 text-gray-600";
    }
    // 이번달
    if (isCurrentMonth) {
      return "bg-grayTrans-20032 text-gray-400";
    }
    return "text-gray-200";
  }, [isCurrentMonth, eventsInDay]);

  return (
    <div
      className={`flex items-center relative justify-center p-1 w-[36px] h-[36px] rounded-full my-[12px] ${colorClassNames} ${
        isSelected ? "border-pai-600 border-2" : ""
      }`}
    >
      {isToday && (
        <div className="absolute -top-[10px] bg-system-black text-system-white text-center w-[36px] rounded-xl py-1 text-[10px]">
          오늘
        </div>
      )}
      <span>{day}</span>
    </div>
  );
};

export default CalendarDayContent;
