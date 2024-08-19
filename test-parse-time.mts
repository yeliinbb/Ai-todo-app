import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { parseKoreanTime } from "@/app/api/lib/chat";

dayjs.extend(utc);
dayjs.extend(timezone);

const testCases = ["8월 21일", "8월", "21일", "오후 3시", ""];

const currentDate = dayjs("2023-05-15").tz("Asia/Seoul");

testCases.forEach((testCase) => {
  const result = parseKoreanTime(testCase, currentDate);
  console.log(`Input: "${testCase}"`);
  console.log(`Result:`, result);
  console.log("---");
});
