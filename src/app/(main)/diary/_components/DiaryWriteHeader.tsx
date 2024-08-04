import PreviousButton from "@/components/icons/diaries/PreviousButton";

const DiaryWriteHeader = () => {
  return (
    <div className="h-[72px] relative flex items-center justify-center gap-[8px]">
      <PreviousButton className="cursor-pointer" />
      <p className="text-gray-900 tracking-[0.8px] text-center text-xl leading-7 w-[215px]">일기 쓰기</p>
      <PreviousButton className="invisible" />
    </div>
  );
};

export default DiaryWriteHeader;
