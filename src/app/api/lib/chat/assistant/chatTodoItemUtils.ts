import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuid4 } from "uuid";
import { getFormattedKoreaTime } from "@/lib/utils/getFormattedLocalTime";
import { ChatTodoItem, MessageWithButton } from "@/types/chat.session.type";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Todo } from "@/todos/types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// 서울 시간대 설정
dayjs.tz.setDefault("Asia/Seoul");

type ErrorItem = {
  title?: string;
  error?: string;
};

type SaveTodoResult = {
  success: boolean;
  message?: MessageWithButton;
  error?: string;
  errorItems?: ErrorItem[] | null;
};

export const handleSaveChatTodo = async (
  supabase: SupabaseClient,
  sessionId: string,
  todoItems: ChatTodoItem[]
): Promise<SaveTodoResult> => {
  console.log("handleSaveChatTodo");
  if (todoItems.length > 0) {
    try {
      const { data, errorItems } = await saveChatTodoItems(supabase, sessionId, todoItems);
      let content;

      if (errorItems.length > 0) {
        const errorMessages = errorItems.map((item: ErrorItem) => `${item.title}: ${item.error}`).join("\n");
        content = `투두리스트 저장 중 오류가 발생했습니다. 다음 항목을 저장하지 못했습니다.\n\n${errorMessages}`;

        if (data && data.length > 0) {
          content += "\n\n일부 항목은 성공적으로 저장되었습니다. 저장된 내용을 투두리스트 페이지에서 확인해보세요.";
        } else {
          content += "\n\n모든 항목을 저장하지 못했습니다. 다시 시도해 주세요.";
        }
      } else {
        content = "투두리스트 저장이 완료되었습니다. 저장된 내용을 투두리스트 페이지에서 확인해보세요!";
      }

      const savedMessage: MessageWithButton = {
        role: "assistant",
        content,
        created_at: getFormattedKoreaTime(),
        showSaveButton: false
      };

      return {
        success: errorItems.length === 0,
        message: savedMessage,
        errorItems: errorItems.length > 0 ? errorItems : undefined
      };
    } catch (error) {
      console.error("Error saving todo items:", error);
      return { success: false, error: "투두 항목 저장 중 오류가 발생했습니다.", errorItems: [] };
    }
  }
  return { success: false, error: "저장할 투두리스트 항목이 없습니다.", errorItems: [] };
};

type TimeResult = {
  hours: number;
  minutes: number;
  date: dayjs.Dayjs;
};

export const parseKoreanTime = (
  timeString: ChatTodoItem["time"],
  currentTime: dayjs.Dayjs = dayjs().tz("Asia/Seoul")
): TimeResult | null | { error: string } => {
  if (!timeString) return null;

  console.log(`Parsing time string: "${timeString}"`);

  const dateTimeRegex =
    /(?:(\d{1,2})(?:\s*월|\.|\/)\s*(?:(\d{1,2})(?:\s*일)?)?)?\s*(오전|오후|아침|점심|낮|저녁|밤|새벽)?\s*(\d{1,2})?\s*(시|:|분)?\s*(오전|오후|아침|점심|낮|저녁|밤|새벽)?/;
  const match = timeString.match(dateTimeRegex);

  if (!match) {
    return {
      error:
        "올바른 날짜/시간 형식이 아닙니다. '월 일 시간' 또는 '시간' 형식으로 입력해주세요. (예: 8월 15일 오후 3시 또는 오후 3시)"
    };
  }

  if (match) {
    console.log("Regex match:", match);
    const [fullMatch, monthStr, dayStr, periodBefore, hourStr, timeUnit, periodAfter, input] = match;
    console.log(
      `Extracted values: monthString=${monthStr}, dayString=${dayStr}, periodBefore=${periodBefore}, hourStr=${hourStr}, timeUnit=${timeUnit}, periodAfter=${periodAfter}, input=${input}`
    );

    console.log("monthStr", typeof monthStr);
    console.log("dayStr", typeof dayStr);
    let month = monthStr ? parseInt(monthStr) : currentTime.month() + 1;
    let day = dayStr ? parseInt(dayStr) : currentTime.date();
    let hours = hourStr ? parseInt(hourStr) : 0;
    const minutes = timeUnit === "분" ? hours : 0;
    const period = periodBefore || periodAfter;

    console.log(`Parsed time: hours=${month}, hours=${day}, hours=${hours}, minutes=${minutes}, period=${period}`);

    let date;

    // 날짜 유효성 검사
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return { error: "유효하지 않은 월입니다. 1에서 12 사이의 값을 입력해주세요." };
    }

    const daysInMonth = dayjs()
      .year(currentTime.year())
      .month(month - 1)
      .daysInMonth();
    if (day < 1 || day > daysInMonth) {
      return { error: `유효하지 않은 일자입니다. 1에서 ${daysInMonth} 사이의 값을 입력해주세요.` };
    }

    // 시간 유효성 검사
    if (hours < 0 || hours > 23) {
      return { error: "유효하지 않은 시간입니다. 0에서 23 사이의 값을 입력해주세요." };
    }

    if (minutes < 0 || minutes > 59) {
      return { error: "유효하지 않은 분입니다. 0에서 59 사이의 값을 입력해주세요." };
    }

    if (month || day) {
      // 월이나 일 중 하나라도 있는 경우
      date = dayjs().year(currentTime.year()); // 현재 년도 사용
      console.log(`Initial date set to current year: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);

      // 전체 날짜/시간 유효성 검사
      if (!date.isValid()) {
        return { error: "유효하지 않은 날짜/시간입니다." };
      }

      if (month) {
        date = date.month(month - 1);
        console.log(`After setting month: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
      }

      if (day) {
        date = date.date(day);
        console.log(`After setting day: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
      } else if (month) {
        date = date.date(1); // 월만 있고 일자 정보가 없으면 1일로 설정
        console.log(`Set to first day of month: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
      }
    } else {
      // 날짜 정보가 전혀 없는 경우
      date = currentTime.clone();
      console.log(`No date info, using current time: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
    }

    if (timeUnit && timeUnit !== "분") {
      hours = adjustHours(hours, period, date);
      date = date.hour(hours).minute(minutes);
      console.log(`After setting time: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
    } else if (!timeUnit) {
      date = date.startOf("day"); // 시간 정보가 없으면 00:00으로 설정
      console.log(`No time info, set to start of day: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
    }

    console.log(`Final parsed date: ${date.format("YYYY-MM-DD HH:mm:ssZ")}`);
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
    case "낮":
      return hours >= 12 && hours < 18 ? hours : hours + 12; // 낮은 12시부터 18시까지로 가정
    default:
      // 오전/오후가 명시되지 않은 경우
      if (hours === 12) return 12; // 12시는 정오로 처리
      if (hours >= 1 && hours <= 6) return hours + 12; // 1시~6시는 오후로 가정
      if (hours > 6 && hours < 12) {
        // 7시~11시는 현재 시간을 기준으로 가장 가까운 시간 선택
        const currentHour = currentTime.hour();
        return Math.abs(currentHour - hours) < Math.abs(currentHour - (hours + 12)) ? hours : hours + 12;
      }
      return hours;
  }
};

type ProcessedTodoItem = {
  todo_id: string;
  created_at: string;
  todo_title: string;
  todo_description?: string | null;
  user_id: string;
  address?: {
    coord?: {
      lat: number | null;
      lng: number | null;
    };
    placeName?: string | null;
    address?: null;
    roadAddress?: null;
  } | null;
  event_datetime: string;
  is_done: boolean;
  is_chat: boolean;
  is_all_day_event: boolean;
};

type ProcessTodoItemsResult = {
  processedItems: ProcessedTodoItem[] | null;
  errorItems: ErrorItem[];
};

const processTodoItems = (items: ChatTodoItem[], user: { id: string }): ProcessTodoItemsResult => {
  const currentTime = dayjs().tz("Asia/Seoul");
  const processedItems: ProcessedTodoItem[] = [];
  const errorItems: ErrorItem[] = [];

  items.forEach((item) => {
    try {
      console.log(`Processing item: ${JSON.stringify(item)}`);
      const parsedResult = parseKoreanTime(item.time, currentTime);
      console.log(`parsedTime: ${JSON.stringify(parsedResult)}`);

      let eventDatetime: dayjs.Dayjs;
      let isAllDayEvent: boolean;

      if (!parsedResult) {
        // 시간 정보가 제공되지 않은 경우
        console.log(`No time information provided`);
        eventDatetime = currentTime.startOf("day");
        isAllDayEvent = true;
      } else if ("error" in parsedResult) {
        console.log(`Error parsing time: ${parsedResult.error}`);
        errorItems.push({
          title: item.title,
          error: parsedResult.error
        });
        return; // 현재 항목 처리 중단
      } else {
        const { hours, minutes, date } = parsedResult;
        eventDatetime = date;
        isAllDayEvent = hours === 0 && minutes === 0;
      }

      console.log(`Event datetime: ${eventDatetime.format("YYYY-MM-DD HH:mm:ssZ")}`);
      console.log(`Is all day event: ${isAllDayEvent}`);

      processedItems.push({
        todo_id: uuid4(),
        created_at: currentTime.format("YYYY-MM-DD HH:mm:ssZ"),
        todo_title: item.title ?? "",
        todo_description: item.description || null,
        user_id: user.id,
        address:
          item.location || item.latitude || item.longitude
            ? {
                coord: {
                  lat: item.latitude ?? null,
                  lng: item.longitude ?? null
                },
                placeName: item.location || null,
                address: null,
                roadAddress: null
              }
            : null,
        event_datetime: eventDatetime.format("YYYY-MM-DD HH:mm:ssZ"),
        is_done: false,
        is_chat: true,
        is_all_day_event: isAllDayEvent
      });
    } catch (error) {
      console.error(`Error processing item: ${JSON.stringify(item)}`, error);
      errorItems.push({
        title: item.title,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  return {
    processedItems: processedItems.length > 0 ? processedItems : null,
    errorItems
  };
};

type SaveChatTodoItemsResult = {
  data: Todo[] | null; // Supabase insert 결과의 실제 타입으로 대체해야 합니다.
  errorItems: ErrorItem[];
};

const saveChatTodoItems = async (
  supabase: SupabaseClient,
  sessionId: string,
  items: ChatTodoItem[]
): Promise<SaveChatTodoItemsResult> => {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting User Data", userError);
    throw userError;
  }

  console.log("items", items);

  const { processedItems, errorItems } = processTodoItems(items, user);

  if (processedItems?.length === 0) {
    console.error("No valid items to insert");
    return { data: null, errorItems };
  }

  const { data, error } = await supabase.from("todos").insert(processedItems);

  if (error) {
    console.error("Error saving chat todo items", error);
    errorItems.push({ title: "Database Error", error: error.message });
  }
  return { data, errorItems };
};

const extractTodoItemsToSave = (content: string) => {
  return content
    .replace(/^.*투두리스트:?/i, "") // "투두리스트:" 부분 제거
    .replace(/[•*-]\s*/g, "") // 모든 글머리 기호 제거
    .split("\n")
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter((item) => item !== "" && !item.toLowerCase().includes("위 내용을"));
};
