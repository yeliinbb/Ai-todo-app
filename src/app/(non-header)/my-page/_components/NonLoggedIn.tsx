import RoundNextBtn from "@/components/icons/myPage/RoundNextBtn";
import Link from "next/link";

const NonLoggedIn = () => {
  return (
    <div className="h-[calc(100vh-105px)]">
      <div className="min-w-[343px] min-h-[60px] flex flex-col justify-between">
        <h1 className="desktop:text-[32px] desktop:mt-52 w-full text-[22px] text-gray-900 font-bold leading-7">
          로그인 후,
        </h1>
        <h1 className="desktop:text-[32px] desktop:mt-8 w-full text-[22px] text-gray-900 font-bold leading-7">
          서비스 이용이 가능합니다
        </h1>
      </div>
      <div
        className={`desktop:min-w-[580px] desktop:rounded-[40px] desktop:mt-11 flex flex-col justify-center relative px-5 py-4 min-w-[347px] min-h-[76px] mt-7 bg-system-white border-2 border-pai-200 rounded-[32px] hover:cursor-pointer duration-200 hover:border-pai-400 active:border-pai-200 active:bg-pai-400 text-gray-400 hover:text-pai-400 active:text-system-white`}
      >
        <Link href={"/login"}>
          <h1 className="desktop:text-[22px] text-pai-400 font-extrabold text-lg leading-7 active:text-system-white z-10">
            로그인 하러가기
          </h1>
          <div className="absolute right-5 top-5 -translate-y-0.5">
            <RoundNextBtn />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NonLoggedIn;
