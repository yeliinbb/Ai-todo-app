import { useMemo } from "react";
import { CalendarEvent } from ".";
import dayjs from "dayjs";

export type CalenderColors = "pai" | "fai";
const colorThemes = {
  pai: {
    thisMonth: "bg-grayTrans-20032 text-gray-400",
    otherMonth: "text-gray-200",
    existEvents: "bg-pai-200 text-gray-600",
    allDoneEvents: "bg-pai-400 text-white",
    selected: "border-pai-600 border-2"
  },
  fai: {
    thisMonth: "bg-grayTrans-20032 text-gray-400",
    otherMonth: "text-gray-200",
    existEvents: "bg-fai-200 text-gray-600",
    allDoneEvents: "bg-fai-400 text-white",
    selected: "border-fai-600 border-2"
  }
};

interface CalendarDayContentProps {
  day: number;
  date: dayjs.Dayjs;
  events: CalendarEvent[];
  isToday?: boolean;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  color: CalenderColors;
}

const CalendarDayContent = ({
  day,
  date,
  events,
  isToday,
  isCurrentMonth,
  isSelected,
  color
}: CalendarDayContentProps) => {
  const eventsInDay = useMemo(() => {
    return events?.filter((event) => dayjs(event.date).isSame(date, "day")) ?? [];
  }, [events, date]);

  const colorClassNames = useMemo(() => {
    // 투두가 있을 때
    if (eventsInDay.length > 0) {
      // 모두 완료
      if (eventsInDay.every((e) => e.done)) {
        return colorThemes[color]?.allDoneEvents;
      }
      // 미완료
      return colorThemes[color]?.existEvents;
    }
    // 이번달
    if (isCurrentMonth) {
      return colorThemes[color]?.thisMonth;
    }
    return colorThemes[color]?.otherMonth;
  }, [isCurrentMonth, eventsInDay, color]);

  return (
    <div
      className={`flex items-center relative justify-center p-1 w-[36px] h-[36px] rounded-full my-[12px] ${colorClassNames} ${
        isSelected ? colorThemes[color]?.selected : ""
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
