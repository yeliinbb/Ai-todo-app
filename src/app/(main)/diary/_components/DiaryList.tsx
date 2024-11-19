"use client";
import DiaryContent from "./DiaryContent";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { useQuery } from "@tanstack/react-query";
import { DIARY_TABLE } from "@/lib/constants/tableNames";
import diaryFetchAllData from "@/lib/utils/diaries/diaryFetchAllData";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import Calendar from "@/components/Calendar";
import Loading from "@/app/loading/loading";

const DiaryList: React.FC = () => {
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

  if (isPending) {
    return <Loading />;
  }

  return (
    <>
      {/* <div className="flex flex-col bg-system-white box-border relative top-[4.5rem] h-[calc(100vh-72px)]"> */}
      <div
        className={`bg-gray-100 box-border relative top-[5.375rem] ${isDesktop ? "h-[calc(100vh-5.375rem)] grid items-center gap-6 grid-rows-1 grid-cols-2" : "flex flex-col h-[calc(100dvh-5.375rem)]"}`}
      >
        <Calendar
          selectedDate={new Date(selectedDate)}
          onChange={handleDateChange}
          initialCollapsed={isDesktop}
          color="fai"
          events={diaryAllData}
          className="desktop:h-full desktop:flex desktop:items-center desktop:justify-center desktop:ml-[2.25rem] desktop:pb-[100px]"
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

export default DiaryList;
