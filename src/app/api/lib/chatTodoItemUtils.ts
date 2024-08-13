import { CHAT_SESSIONS } from "@/lib/constants/tableNames";
import { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { v4 as uuid4 } from "uuid";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// 서울 시간대 설정
dayjs.tz.setDefault("Asia/Seoul");

type TodoItem = {
  title: string;
  description: string;
  time: string | null;
  location: string;
  longitude: number;
  latitude: number;
};

// FormattedTodoItem 타입 정의
type FormattedTodoItem = {
  title: string;
  description?: string;
  time?: string | null;
  location?: string;
  latitude?: number;
  longitude?: number;
  is_all_day_event: boolean;
};

export const handleSaveChatTodo = async (supabase: SupabaseClient, sessionId: string) => {
  const { data: sessionData } = await supabase
    .from(CHAT_SESSIONS)
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  if (sessionData && sessionData.messages) {
    const lastMessage = sessionData.messages[sessionData.messages.length - 1];
    if (lastMessage && typeof lastMessage.content === "string") {
      console.log("lastMessage.content:", lastMessage.content);
      try {
        const todoItem = parseTodoString(lastMessage.content);
        if (todoItem) {
          await saveChatTodoItems(supabase, sessionId, [todoItem]);
          return {
            success: true,
            message:
              "투두리스트가 저장되었습니다. 새로운 투두리스트를 작성하고 싶다면 투두리스트 작성하기 버튼을, 아니라면 새로운 대화를 이어나가보세요!"
          };
        }
      } catch (error) {
        console.error("Error processing last message content:", error);
        return { success: false, error: "메시지 처리 중 오류가 발생했습니다." };
      }
    }
  }
  return { success: false, error: "저장할 투두리스트 항목이 없습니다." };
};

function parseTodoString(content: string): FormattedTodoItem | null {
  const match = content.match(/^•\s*(.+?)\s+(오전|오후)\s+(\d{1,2})시\s*:?\s*(.*)$/);
  if (match) {
    const [, title, period, hour, description] = match;
    const formattedHour = period === "오후" && hour !== "12" ? parseInt(hour) + 12 : parseInt(hour);
    const time = `${formattedHour.toString().padStart(2, "0")}:00`;

    return {
      title,
      description: description.trim(),
      time,
      location: "", // 위치 정보가 없으므로 빈 문자열로 설정
      latitude: 0, // 위도 정보가 없으므로 0으로 설정
      longitude: 0, // 경도 정보가 없으므로 0으로 설정
      is_all_day_event: false
    };
  }
  return null;
}

const formatTodoItem = (item: TodoItem): FormattedTodoItem => {
  let formattedTime = null;
  if (item.time) {
    const timeString = item.time.toLowerCase();
    if (timeString.includes("오전")) {
      formattedTime = dayjs.tz(timeString, "A h시", "Asia/Seoul").format("HH:mm");
    } else if (timeString.includes("오후")) {
      formattedTime = dayjs.tz(timeString, "A h시", "Asia/Seoul").format("HH:mm");
    } else {
      formattedTime = dayjs.tz(timeString, "H시", "Asia/Seoul").format("HH:mm");
    }
  }

  return {
    title: item.title,
    description: item.description || "",
    time: formattedTime,
    latitude: item.latitude || 0,
    longitude: item.longitude || 0,
    is_all_day_event: !formattedTime
  };
};

const saveChatTodoItems = async (supabase: SupabaseClient, sessionId: string, items: FormattedTodoItem[]) => {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting User Data", userError);
    throw userError;
  }
  console.log("items", items);
  const todoToInsert = items.map((item) => {
    let eventDatetime = null;
    if (item.time) {
      // 현재 날짜와 입력된 시간을 결합
      const now = dayjs().tz("Asia/Seoul");
      eventDatetime = now
        .hour(parseInt(item.time.split(":")[0]))
        .minute(parseInt(item.time.split(":")[1]))
        .second(0)
        .millisecond(0)
        .toISOString();
    }

    return {
      todo_id: uuid4(),
      created_at: dayjs().tz("Asia/Seoul").toISOString(),
      todo_title: item.title,
      todo_description: item.description || null,
      user_id: user.id,
      address: { lat: item.latitude || 0, lng: item.longitude || 0 },
      event_datetime: eventDatetime,
      is_done: false,
      is_chat: true,
      is_all_day_event: !item.time
    };
  });

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
