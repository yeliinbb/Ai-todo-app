"use client";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import Calendar from "@/shared/ui/Calendar";
import { useQuery } from "@tanstack/react-query";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import diaryFetchAllData from "@/lib/utils/diaries/diaryFetchAllData";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";

const DiaryListPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });
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
  console.log(diaryAllData)
  if (isPending) {
    return (
      <span className="pai-loader w-full h-screen flex flex-col items-center text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
    );
  }
  return (
    <>
      {/* <div className="flex flex-col bg-system-white box-border relative top-[4.5rem] h-[calc(100vh-72px)]"> */}
      <div
        className={`bg-gray-100 box-border relative top-[5.375rem] ${isDesktop ? "h-[calc(100vh-5.375rem)] grid items-center gap-10 grid-rows-1 grid-cols-2" : "flex flex-col h-[calc(100dvh-5.375rem)]"}`}
      >
        <Calendar
          selectedDate={new Date(selectedDate)}
          onChange={handleDateChange}
          initialCollapsed={isDesktop}
          color="fai"
          events={diaryAllData}
          className="desktop:h-4/6 desktop:pl-[3.25rem] desktop:mb-[7.625rem]"
        />

        <div className={`bg-gray-100 ${isDesktop ? "h-full" : "flex-grow"}`}>
          <div
            className={`border-b-0 box-border ${isDesktop ? "desktop:rounded-t-[5.625rem] desktop:h-full desktop:overflow-y-auto desktop:border-4 border-fai-400 desktop:scrollbar-hide desktop:border-b-0 desktop:scroll-smooth bg-faiTrans-20060" : "bg-faiTrans-20060 rounded-t-[3rem] h-full flex-grow border-2 border-fai-400"}`}
          >
            <DiaryContent date={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryListPage;
