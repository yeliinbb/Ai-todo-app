import { useMemo } from "react";

type TimeValueType = [number, number];
export interface TimeSelectProps {
  value?: TimeValueType;
  onChange?: (value: TimeValueType | undefined) => void;
}
const options = [
  { label: "오전 12:00", value: "0:0" },
  { label: "오전 12:30", value: "0:30" },
  { label: "오전 01:00", value: "1:0" },
  { label: "오전 01:30", value: "1:30" },
  { label: "오전 02:00", value: "2:0" },
  { label: "오전 02:30", value: "2:30" },
  { label: "오전 03:00", value: "3:0" },
  { label: "오전 03:30", value: "3:30" },
  { label: "오전 04:00", value: "4:0" },
  { label: "오전 04:30", value: "4:30" },
  { label: "오전 05:00", value: "5:0" },
  { label: "오전 05:30", value: "5:30" },
  { label: "오전 06:00", value: "6:0" },
  { label: "오전 06:30", value: "6:30" },
  { label: "오전 07:00", value: "7:0" },
  { label: "오전 07:30", value: "7:30" },
  { label: "오전 08:00", value: "8:0" },
  { label: "오전 08:30", value: "8:30" },
  { label: "오전 09:00", value: "9:0" },
  { label: "오전 09:30", value: "9:30" },
  { label: "오전 10:00", value: "10:0" },
  { label: "오전 10:30", value: "10:30" },
  { label: "오전 11:00", value: "11:0" },
  { label: "오전 11:30", value: "11:30" },
  { label: "오후 12:00", value: "12:0" },
  { label: "오후 12:30", value: "12:30" },
  { label: "오후 01:00", value: "13:0" },
  { label: "오후 01:30", value: "13:30" },
  { label: "오후 02:00", value: "14:0" },
  { label: "오후 02:30", value: "14:30" },
  { label: "오후 03:00", value: "15:0" },
  { label: "오후 03:30", value: "15:30" },
  { label: "오후 04:00", value: "16:0" },
  { label: "오후 04:30", value: "16:30" },
  { label: "오후 05:00", value: "17:0" },
  { label: "오후 05:30", value: "17:30" },
  { label: "오후 06:00", value: "18:0" },
  { label: "오후 06:30", value: "18:30" },
  { label: "오후 07:00", value: "19:0" },
  { label: "오후 07:30", value: "19:30" },
  { label: "오후 08:00", value: "20:0" },
  { label: "오후 08:30", value: "20:30" },
  { label: "오후 09:00", value: "21:0" },
  { label: "오후 09:30", value: "21:30" },
  { label: "오후 10:00", value: "22:0" },
  { label: "오후 10:30", value: "22:30" },
  { label: "오후 11:00", value: "23:0" },
  { label: "오후 11:30", value: "23:30" }
];

const TimeSelect = ({ value, onChange }: TimeSelectProps) => {
  return (
    <select
      value={value ? `${value[0]}:${value[1]}` : ""}
      onChange={(e) => {
        const changed = e.target.value; // 23:30
        onChange?.(parseTimeString(changed));
      }}
      className="outline-none"
    >
      <option value="">선택안함</option>
      {options.map((o) => (
        <option key={o.label} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

function parseTimeString(timeString: string) {
  const splitted = timeString.split(":");
  if (splitted.length === 2) {
    return [Number(splitted[0]), Number(splitted[1])] as TimeValueType;
  }
  return undefined;
}
export default TimeSelect;
