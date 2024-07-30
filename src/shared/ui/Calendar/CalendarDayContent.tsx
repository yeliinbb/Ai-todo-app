import { HTMLAttributes, useMemo } from "react";
import { CalendarEvent } from ".";
import dayjs from "dayjs";

interface CalendarDayContentProps {
  day: number;
  date: Date;
  events: CalendarEvent[];
}

export default function CalendarDayContent({ day, date, events }: CalendarDayContentProps) {
  const eventsInDay = events?.filter((event) => dayjs(event.date).isSame(dayjs(date), "day")) ?? [];

  return (
    <div className="flex items-center relative justify-center p-1 h-8">
      {eventsInDay.length > 0 && <DayContentEventDot className="absolute top-auto -translate-y-3" />}
      <span>{day}</span>
    </div>
  );
}

function DayContentEventDot({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`bg-purple-500 rounded-full w-1 h-1 ${className}`} {...rest}></span>;
}
