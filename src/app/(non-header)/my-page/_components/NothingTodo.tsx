import NextBtn from "@/components/icons/authIcons/NextBtn";

const NothingTodo = () => {
  return (
    <>
      <div className="flex flex-col">
        <div>
          <h1 className="min-w-[200px] leading-7 font-bold text-base text-gray-400">아직 작성된 투두리스트가 없어요</h1>
          <h3 className="min-w-[200px] leading-7 font-medium text-sm text-gray-400">투두리스트를 만들러 가볼까요?</h3>
        </div>
        <div className="absolute right-5">
          <NextBtn />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px] text-center text-gray-100">투두바</div>
        <h3 className="text-right text-sm font-bold leading-5 text-gray-400">- / -</h3>
      </div>
    </>
  );
};

export default NothingTodo;
