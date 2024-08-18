"use client";
import PreviousButton from "@/components/icons/diaries/PreviousButton";
import CloseBtn from "@/components/icons/modal/CloseBtn";
import { useDiaryStore } from "@/store/useDiary.store";
import { usePathname, useRouter } from "next/navigation";

const DiaryWriteHeader = ({ headerText, firstDiary }: { headerText: string; firstDiary?: boolean }) => {
  const route = useRouter();
  const { setFetchingTodos } = useDiaryStore();
  const pathName = usePathname();

  const previousButton = () => {
    setFetchingTodos(false);
    if (pathName.split("/")[2] === "diary-detail") {
      route.push("/diary");
    } else {
      route.back();
    }
  };
  return (
    <div className="h-[46px] relative flex items-center justify-center gap-[8px] pt-6 mb-5">
      <div className={`${firstDiary ? "invisible" : ""} rounded-full p-3 border border-gray-200 bg-system-white`}>
        <PreviousButton className={`cursor-pointer text-gray-700 `} onClick={previousButton} />
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
