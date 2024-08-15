import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getFormattedKoreaTime(time?: string): string {
  let now = dayjs().tz("Asia/Seoul");

  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    now = dayjs(now.format("YYYY-MM-DD")).tz("Asia/Seoul"); // Reset to start of day
    now = now.add(hours, "hour");
    now = now.add(minutes, "minute");
    now = now.second(0).millisecond(0);
  }

  return now.format("YYYY-MM-DD HH:mm:ss+09");
}

export function getFormattedKoreaTimeWithOffset(offsetMs: number = 1): string {
  const now = dayjs().tz("Asia/Seoul");
  return now.add(offsetMs, "millisecond").format("YYYY-MM-DD HH:mm:ss.SSS+09");
}
