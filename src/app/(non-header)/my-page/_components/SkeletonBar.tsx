import RoundNextBtn from "@/components/icons/myPage/RoundNextBtn";

const SkeletonBar = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[166px] mt-10 bg-system-white border-2 border-grayTrans-30080 rounded-[32px]">
      <div className="flex flex-col">
        <div>
          <h1 className="min-w-[200px] leading-7 font-bold text-base text-gray-400">투두를 불러오고 있어요</h1>
          <h3 className="min-w-[200px] leading-7 font-medium text-sm text-gray-400">조금만 기다려주세요</h3>
        </div>
        <div className="absolute right-5">
          <RoundNextBtn />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px] text-center text-gray-100">투두바</div>
        <h3 className="text-right text-sm font-bold leading-5 text-gray-400">- / -</h3>
      </div>
    </div>
  );
};

export default SkeletonBar;
