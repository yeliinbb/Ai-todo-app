import CalendarSvg from "../../assets/calendar.svg";

interface CalendarIconProps {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}

const CalendarIcon = ({ width, height, fill, className }: CalendarIconProps) => {
  return (
    <div
      className={`inline-flex items-center justify-center CalendarIconProps ${className || ""}`}
      style={{ width, height }}
    >
      <CalendarSvg width="100%" height="100%" fill={fill} className={className} />
    </div>
  );
};

export default CalendarIcon;
