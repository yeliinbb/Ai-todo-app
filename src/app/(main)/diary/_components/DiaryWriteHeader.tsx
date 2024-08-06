"use client";
import PreviousButton from "@/components/icons/diaries/PreviousButton";
import { useDiaryStore } from "@/store/useDiary.store";
import { useRouter } from "next/navigation";

const DiaryWriteHeader = ({ headerText }: { headerText: string }) => {
  const route = useRouter();
  const { setFetchingTodos } = useDiaryStore();
  return (
    <div
      className="h-[72px] relative flex items-center justify-center gap-[8px]"
      onClick={() => {
        setFetchingTodos(false);
        route.back();
      }}
    >
      <PreviousButton className="cursor-pointer" />
      <p className="text-gray-900 tracking-[0.8px] text-center text-xl leading-7 w-[215px]">{headerText}</p>
      <PreviousButton className="invisible" />
    </div>
  );
};

export default DiaryWriteHeader;
