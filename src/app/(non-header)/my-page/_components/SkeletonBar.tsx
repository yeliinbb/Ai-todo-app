import RoundNextBigBtn from "@/components/icons/myPage/RoundNextBigBtn";
import RoundNextBtn from "@/components/icons/myPage/RoundNextBtn";

const SkeletonBar = () => {
  return (
    <div className="desktop:min-w-[580px] desktop:min-h-[248px] desktop:rounded-[52px] desktop:border-4 desktop:p-10 animate-pulse flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[164px] mt-10 bg-system-white border-2 border-grayTrans-30080 rounded-[32px]">
      <div className="flex flex-col">
        <div>
          <h1 className="desktop:text-[22px] desktop:mb-3 min-w-[200px] leading-7 font-bold text-base text-gray-400">
            투두를 불러오고 있어요
          </h1>
          <h3 className="desktop:text-[20px] min-w-[200px] leading-7 font-medium text-sm text-gray-400">
            조금만 기다려주세요
          </h3>
        </div>
        <div className="desktop:top-9 desktop:right-10 absolute right-5 text-gray-300">
          <div className="desktop:hidden block">
            <RoundNextBtn />
          </div>
          <div className="desktop:block hidden">
            <RoundNextBigBtn />
          </div>
        </div>
      </div>
      <div className="desktop:mt-9 flex flex-col gap-1">
        <div className="desktop:min-w-[500px] desktop:min-h-[32px] min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px] text-center text-gray-100">
          투두바
        </div>
        <h3 className="text-right text-sm font-bold leading-5 text-gray-400">- / -</h3>
      </div>
    </div>
  );
};

export default SkeletonBar;
