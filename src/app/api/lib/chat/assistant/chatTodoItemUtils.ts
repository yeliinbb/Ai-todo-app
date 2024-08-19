import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuid4 } from "uuid";
import { getFormattedKoreaTime } from "@/lib/utils/getFormattedLocalTime";
import { ChatTodoItem, MessageWithButton } from "@/types/chat.session.type";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// 서울 시간대 설정
dayjs.tz.setDefault("Asia/Seoul");

export const handleSaveChatTodo = async (supabase: SupabaseClient, sessionId: string, todoItems: ChatTodoItem[]) => {
  console.log("handleSaveChatTodo");
  if (todoItems.length > 0) {
    try {
      await saveChatTodoItems(supabase, sessionId, todoItems);
      const savedMessage: MessageWithButton = {
        role: "assistant",
        content: "투두리스트 저장이 완료되었습니다. 저장된 내용을 투두리스트 페이지에서 확인해보세요!",
        created_at: getFormattedKoreaTime(),
        showSaveButton: false
      };
      return {
        success: true,
        message: savedMessage
      };
    } catch (error) {
      console.error("Error saving todo items:", error);
      return { success: false, error: "투두 항목 저장 중 오류가 발생했습니다." };
    }
  }
  return { success: false, error: "저장할 투두리스트 항목이 없습니다." };
};

type TimeResult = {
  hours: number;
  minutes: number;
  date: dayjs.Dayjs;
};

export const parseKoreanTime = (
  timeString: string,
  currentTime: dayjs.Dayjs = dayjs().tz("Asia/Seoul")
): TimeResult | null => {
  if (!timeString) return null;

  console.log(`Parsing time string: "${timeString}"`);

  const dateTimeRegex =
    /(?:(\d{1,2})월\s*(\d{1,2})일)?\s*(오전|오후|아침|점심|저녁|밤|새벽)?\s*(\d{1,2})(시|:|분)?\s*(오전|오후|아침|점심|저녁|밤|새벽)?/;
  const match = timeString.match(dateTimeRegex);

  if (match) {
    console.log("Regex match:", match);
    const [, month, day, periodBefore, hourStr, timeUnit, periodAfter] = match;
    let hours = hourStr ? parseInt(hourStr) : 0;
    const minutes = timeUnit === "분" ? hours : 0;
    const period = periodBefore || periodAfter;

    let date = currentTime.clone().startOf("year"); // 년도만 현재 년도로 설정

    if (month && day) {
      // 월과 일이 모두 있는 경우
      date = date.month(parseInt(month) - 1).date(parseInt(day));
    } else if (month) {
      // 월만 있는 경우
      date = date.month(parseInt(month) - 1).date(1);
    } else if (day) {
      // 일만 있는 경우
      date = currentTime.clone().date(parseInt(day));
    } else {
      // 날짜 정보가 전혀 없는 경우 현재 날짜 사용
      date = currentTime.clone();
    }

    if (timeUnit && timeUnit !== "분") {
      hours = adjustHours(hours, period, date);
      date = date.hour(hours).minute(minutes);
    } else if (!timeUnit) {
      date = date.startOf("day"); // 시간 정보가 없으면 00:00으로 설정
    }

    console.log(`Parsed date: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
    return { hours, minutes, date };
  }

  // HH:mm 형식 처리
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const timeMatch = timeString.match(timeRegex);
  if (timeMatch) {
    console.log("Time format match:", timeMatch);
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const date = currentTime.clone().hour(hours).minute(minutes);
    console.log(`Parsed date: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
    return { hours, minutes, date };
  }

  // 날짜만 있고 시간이 없는 경우
  const dateOnlyRegex = /(\d{1,2})월\s*(?:(\d{1,2})일)?/;
  const dateOnlyMatch = timeString.match(dateOnlyRegex);
  if (dateOnlyMatch) {
    console.log("Date only match:", dateOnlyMatch);
    const [, month, day] = dateOnlyMatch;
    let date;

    if (month && day) {
      date = currentTime
        .clone()
        .month(parseInt(month) - 1)
        .date(parseInt(day));
    } else if (month) {
      date = currentTime
        .clone()
        .month(parseInt(month) - 1)
        .date(1);
    } else {
      // 이 경우는 실제로 발생하지 않아야 하지만, 안전을 위해 추가
      date = currentTime.clone();
    }

    date = date.startOf("day"); // 시간을 00:00:00으로 설정
    console.log(`Parsed date: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
    return { hours: 0, minutes: 0, date };
  }

  console.log("No match found");
  return null;
};

const adjustHours = (hours: number, period: string | undefined, currentTime: dayjs.Dayjs): number => {
  switch (period) {
    case "오후":
    case "저녁":
    case "밤":
      return hours < 12 ? hours + 12 : hours;
    case "오전":
    case "아침":
      return hours === 12 ? 0 : hours;
    case "새벽":
      return hours === 12 ? 0 : hours > 6 ? hours + 12 : hours;
    case "점심":
      return hours < 12 ? hours + 12 : hours;
    default:
      if (hours >= 1 && hours <= 6) {
        return hours + 12;
      } else if (hours < currentTime.hour()) {
        return hours + 12;
      }
      return hours;
  }
};

const processTodoItems = (items: any[], user: { id: string }) => {
  const currentTime = dayjs().tz("Asia/Seoul");

  return items
    .map((item) => {
      try {
        console.log(`Processing item: ${JSON.stringify(item)}`);
        const parsedTime = parseKoreanTime(item.time, currentTime);
        console.log(`parsedTime: ${JSON.stringify(parsedTime)}`);

        let eventDatetime;
        let isAllDayEvent = !item.time;

        if (parsedTime) {
          eventDatetime = parsedTime.date;
          // 날짜만 있고 시간이 없는 경우 또는 시간이 00:00인 경우
          isAllDayEvent = parsedTime.hours === 0 && parsedTime.minutes === 0;
        } else {
          // parsedTime이 null인 경우 (시간 정보가 전혀 없는 경우)
          eventDatetime = currentTime.clone().startOf("day");
        }

        console.log(`Event datetime: ${eventDatetime.format("YYYY-MM-DD HH:mm:ssZ")}`);
        console.log(`Is all day event: ${isAllDayEvent}`);

        return {
          todo_id: uuid4(),
          created_at: currentTime.format(),
          todo_title: item.title,
          todo_description: item.description || null,
          user_id: user.id,
          address: {
            coord: {
              lat: item.latitude || null,
              lng: item.longitude || null
            },
            placeName: item.location || null,
            address: null,
            roadAddress: null
          },
          event_datetime: eventDatetime.format(),
          is_done: false,
          is_chat: true,
          is_all_day_event: isAllDayEvent
        };
      } catch (error) {
        console.error(`Error processing item: ${JSON.stringify(item)}`, error);
        return null;
      }
    })
    .filter((item) => item !== null);
};

const saveChatTodoItems = async (supabase: SupabaseClient, sessionId: string, items: ChatTodoItem[]) => {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting User Data", userError);
    throw userError;
  }

  console.log("items", items);

  const todoToInsert = processTodoItems(items, user);

  if (todoToInsert.length === 0) {
    console.error("No valid items to insert");
    throw new Error("No valid items to insert");
  }

  const { data, error } = await supabase.from("todos").insert(todoToInsert);

  if (error) {
    console.error("Error saving chat todo items", error);
    throw error;
  }
  return data;
};

const extractTodoItemsToSave = (content: string) => {
  return content
    .replace(/^.*투두리스트:?/i, "") // "투두리스트:" 부분 제거
    .replace(/[•*-]\s*/g, "") // 모든 글머리 기호 제거
    .split("\n")
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter((item) => item !== "" && !item.toLowerCase().includes("위 내용을"));
};
