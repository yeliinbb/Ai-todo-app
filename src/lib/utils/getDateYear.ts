import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateYear = (dateString: string) => {
  const parsedDate = dayjs(dateString).tz("Asia/Seoul"); // 입력된 날짜를 서울 타임존으로 변환

  const year = parsedDate.format("YYYY");
  const month = parsedDate.format("MM");
  const day = parsedDate.format("DD");

  return `${year}년 ${month}월 ${day}일`;
};
