import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuid4 } from "uuid";
import { getFormattedKoreaTime } from "@/lib/utils/getFormattedLocalTime";
import { ChatTodoItem } from "@/types/chat.session.type";
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
      return {
        success: true,
        message:
          "투두리스트가 저장되었습니다. 새로운 투두리스트를 작성하고 싶다면 투두리스트 작성하기 버튼을, 아니라면 새로운 대화를 이어나가보세요!"
      };
    } catch (error) {
      console.error("Error saving todo items:", error);
      return { success: false, error: "투두 항목 저장 중 오류가 발생했습니다." };
    }
  }
  return { success: false, error: "저장할 투두리스트 항목이 없습니다." };
};

const parseKoreanTime = (timeString: string): { hours: number; minutes: number } | null => {
  // '시' 단위의 한국어 시간 처리 (오전/오후가 앞에 오는 경우 포함)
  const koreanTimeRegex = /^(오전|오후)?\s*(\d{1,2})(시|:|분)?\s*(오전|오후)?$/;
  const match = timeString.match(koreanTimeRegex);

  if (match) {
    let hours = parseInt(match[2]);
    const minutes = match[3] === "분" ? hours : 0; // '분'이 있으면 그 값을 분으로 사용
    const period = match[1] || match[4]; // 오전/오후가 앞에 있거나 뒤에 있는 경우 모두 처리

    if (match[3] !== "분") {
      // '시' 또는 ':'인 경우
      if (period === "오후" && hours < 12) {
        hours += 12;
      } else if (period === "오전" && hours === 12) {
        hours = 0;
      }
    } else {
      hours = 0; // '분'만 있는 경우 시간은 0으로 설정
    }

    return { hours, minutes };
  }

  // HH:mm 형식 처리
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const timeMatch = timeString.match(timeRegex);
  if (timeMatch) {
    return {
      hours: parseInt(timeMatch[1]),
      minutes: parseInt(timeMatch[2])
    };
  }

  return null;
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

  const todoToInsert = items
    .map((item) => {
      let eventDatetime;
      try {
        if (item.time) {
          const parsedTime = parseKoreanTime(item.time);
          if (!parsedTime) {
            console.error(`Failed to parse time: ${item.time}`);
            throw new Error(`Invalid time format: ${item.time}`);
          }
          const { hours, minutes } = parsedTime;
          eventDatetime = dayjs().tz("Asia/Seoul").hour(hours).minute(minutes).second(0).millisecond(0);
          console.log(`Parsed time for "${item.title}": ${eventDatetime.format()}`);
        } else {
          // 시간이 없는 경우 해당 날짜의 00:00:00으로 설정
          eventDatetime = dayjs().tz("Asia/Seoul").startOf("day");
          console.log(`All-day event for "${item.title}": ${eventDatetime.format()}`);
        }

        // ISO 형식으로 변환
        const eventDatetimeToString = eventDatetime.toISOString();

        return {
          todo_id: uuid4(),
          created_at: dayjs().tz("Asia/Seoul").format(),
          todo_title: item.title,
          todo_description: item.description || null,
          user_id: user.id,
          address: { lat: item.latitude || 0, lng: item.longitude || 0 },
          event_datetime: eventDatetimeToString,
          is_done: false,
          is_chat: true,
          is_all_day_event: !item.time
        };
      } catch (error) {
        console.error(`Error processing item: ${JSON.stringify(item)}`, error);
        // 오류가 발생한 항목은 건너뛰고 null을 반환
        return null;
      }
    })
    .filter((item) => item !== null); // null 항목 제거

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
