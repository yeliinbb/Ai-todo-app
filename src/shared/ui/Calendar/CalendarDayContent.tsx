import { useMemo } from "react";
import { CalendarEvent } from ".";
import dayjs from "dayjs";

export type CalenderColors = "pai" | "fai";
const colorThemes = {
  pai: {
    thisMonth: "bg-gray-200 text-gray-400",
    otherMonth: "text-gray-200",
    existEvents: "bg-pai-200 text-gray-900",
    allDoneEvents: "bg-pai-400 text-system-white",
    selected: "outline outline-pai-400 outline-[0.13rem] w-[2.12rem] h-[2.12rem]"
  },
  fai: {
    thisMonth: "bg-gray-200 text-gray-400",
    otherMonth: "text-gray-200",
    existEvents: "bg-fai-400  text-system-white",
    allDoneEvents: "bg-fai-400 text-system-white",
    selected: "outline outline-fai-600 outline-[0.13rem] w-[2.12rem] h-[2.12rem]"
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
    // 다른 달
    if (!isCurrentMonth) {
      return colorThemes[color]?.otherMonth;
    }
    // 투두가 있을 때
    if (eventsInDay.length > 0) {
      // 모두 완료
      if (eventsInDay.every((e) => e.done)) {
        return colorThemes[color]?.allDoneEvents;
      }
      // 미완료
      return colorThemes[color]?.existEvents;
    }
    return colorThemes[color]?.thisMonth;
  }, [isCurrentMonth, eventsInDay, color]);

  return (
    <div
      className={`font-sans text-h7 font-extrabold flex items-center relative justify-center p-1 w-[2.12rem] h-[2.12rem] rounded-full my-3 ${colorClassNames} ${
        isSelected ? colorThemes[color]?.selected : ""
      }
      desktop:my-6`}
    >
      {isToday && (
        <div className="text-c1 text-center absolute -top-[0.75rem] bg-gray-900 text-system-white rounded-[0.75rem] w-[2.25rem] h-[1.25rem] flex items-center justify-center">
          오늘
        </div>
      )}
      <span>{day}</span>
    </div>
  );
};

export default CalendarDayContent;
