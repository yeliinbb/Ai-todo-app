import Link from "next/link";

const FixedActionButton = () => {
  return (
    <div className="sticky bottom-0 left-0 right-0  px-4 py-5">
      <Link
        href={"/home"}
        className="mobile:w-[calc(100%-32px)] mobile:mx-auto desktop:w-[300px] desktop:mx-auto h-[52px] bg-gradient-pai400-fai500-br rounded-full flex flex-row items-center"
      >
        {/* 폰트 굵기를 extraBold로 변경 필요하며 letter-spacing도 tailwind.config에 추가 필요 */}
        <button className="h-7 mobile:w-[calc(100%-88px)] mx-auto text-system-white text-h6">PAi 시작하기</button>
      </Link>
    </div>
  );
};

export default FixedActionButton;
