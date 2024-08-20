"use client";
import PreviousButton from "@/components/icons/diaries/PreviousButton";
import CloseBtn from "@/components/icons/modal/CloseBtn";
import { useThrottle } from "@/hooks/useThrottle";
import { useDiaryStore } from "@/store/useDiary.store";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

const DiaryWriteHeader = ({ headerText, firstDiary }: { headerText: string; firstDiary?: boolean }) => {
  const route = useRouter();
  const { setFetchingTodos } = useDiaryStore();
  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });
  const pathName = usePathname();
  const throttledSave = useThrottle();
  const previousButton = async () => {
    setFetchingTodos(false);
    if (pathName.split("/")[2] === "diary-detail") {
      route.push("/diary");
    } else {
      route.back();
    }
  };
  return (
    <div className={`${isDesktop? 'w-[calc(100%-3.5rem)]':'w-[calc(100%-2rem)]'} h-[2.875rem] relative flex items-center justify-between gap-[8px] pt-6 mb-5 flex-grow flex-shrink-0 mx-auto`}>
      <div className={`${firstDiary ? "invisible" : ""} rounded-full p-3 border border-gray-200 bg-system-white`}>
        <PreviousButton
          className={`cursor-pointer text-gray-700 `}
          onClick={() => throttledSave(previousButton, 1000)}
        />
      </div>
      <p className="text-gray-900 text-sh3 text-center  w-60 ">{headerText}</p>
      <CloseBtn
        onClick={previousButton}
        btnStyle={`cursor-pointer border border-gray-200 rounded-full p-3 box-border w-11 h-11 bg-system-white text-gray-700 ${firstDiary ? "" : "invisible"}`}
      />
    </div>
  );
};

export default DiaryWriteHeader;
