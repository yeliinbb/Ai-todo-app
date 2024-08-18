"use client";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import Calendar from "@/shared/ui/Calendar";
import { useQuery } from "@tanstack/react-query";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import diaryFetchAllData from "@/lib/utils/diaries/diaryFetchAllData";
import { usePathname } from "next/navigation";

const DiaryListPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };
  // [calc(100%-4.5rem-76px)]
  //날짜랑
  // [{date:created_at},{date:created_at},{date:created_at},{date:created_at},{date:created_at}]
  const diaryPathName = usePathname();

  const {
    data: diaryAllData,
    isPending,
    isError
  } = useQuery({
    queryKey: [DIARY_TABLE],
    queryFn: diaryFetchAllData,
    retry: 2,
    enabled: diaryPathName === "/diary",
    staleTime: 1000
  });
  if (isPending) return <div>loading...</div>;
  return (
    <>
      {/* <div className="flex flex-col bg-system-white box-border relative top-[4.5rem] h-[calc(100vh-72px)]"> */}
      <div className="grid grid-rows-[auto_1fr] bg-system-white box-border relative top-[4.5rem] h-[calc(100vh-72px)] overflow-hidden">
        <Calendar
          selectedDate={new Date(selectedDate)}
          onChange={handleDateChange}
          initialCollapsed={false}
          color="fai"
          events={diaryAllData}
        />
        {/* <div className="bg-system-red200 h-[calc(100vh-27.8rem)]"> */}
        <div className=" bg-system-white">
          <div className="h-full overflow-y-auto border-2 border-fai-400 scrollbar-hide scroll-smooth bg-faiTrans-20060 rounded-t-[48px] box-border">
            <DiaryContent date={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryListPage;
