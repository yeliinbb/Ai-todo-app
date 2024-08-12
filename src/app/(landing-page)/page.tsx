import Logo from "@/components/Logo";
import FixedActionButton from "./_components/FixedActionButton";

const LandingPage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="flex overflow-y-auto h-full">
        {/* 모바일 화면 */}
        <div className="flex flex-col flex-grow p-4 w-[calc(100%-32px)] h-[calc(100%-92px)] mx-auto justify-center items-center">
          <Logo />
          <p className="text-h1 mt-2">AI 챗봇 메이트와 함께하는 일정 관리 서비스</p>
        </div>
        {/* 데스크톱 화면 */}
        {/* <div className="hidden desktop:block p-4 bg-gray-100">
          <h1>데스크탑</h1>
          <p>여기에 서비스의 기능 및 소개를 작성합니다. 데스크톱 화면용 콘텐츠입니다.</p>
        </div> */}
      </div>
      {/* 파이 바로가기 화면 아래에 고정 */}
      <FixedActionButton />
    </div>
  );
};

export default LandingPage;
