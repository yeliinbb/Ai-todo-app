import FixedActionButton from "./_components/FixedActionButton";
import Image from "next/image";
import Link from "next/link";

type ServiceDescriptionType = {
  id: number;
  title: string;
  subTitle: string;
  content: string;
  subContent: string;
  src: string;
};

const serviceDescription: ServiceDescriptionType[] = [
  {
    id: 0,
    title: "AI 챗봇 메이트와",
    subTitle: "함께하는 나의 기록",
    content: "바쁜 일상 속에서",
    subContent: "효율적인 일정 관리와 일기 기록",
    src: ""
  },
  {
    id: 1,
    title: "Personal Assistant,",
    subTitle: "PAi와 일정 관리",
    content: "음성 인식과 채팅을 통해",
    subContent: "투두리스트를 추천받고 작성해요",
    src: ""
  },
  {
    id: 2,
    title: "Friendly AI,",
    subTitle: "FAi와의 대화를 일기로",
    content: "FAi와 나눈 대화로",
    subContent: "하루를 요약하고 일기로 만들어요.",
    src: ""
  },
  {
    id: 3,
    title: "투두리스트와 일기를",
    subTitle: "캘린더에서 한 눈에 확인",
    content: "상태별 다른 색상으로",
    subContent: "한 눈에 기록 여부를 확인해요.",
    src: ""
  }
];

const LandingPage = () => {
  return (
    <div className="relative h-screen overflow-hidden w-full bg-gray-100">
      <div className="flex justify-between items-center w-[calc(100%-32px)] py-2.5 fixed top-0 left-1/2 transform -translate-x-1/2 z-20">
        <Image src={"/landingPai.svg"} alt="PAi LOGO" width={61.83} height={100} />
        <Link href={"/login"} className="bg-system-white border border-pai-300 rounded-full px-4 py-0.5">
          <p className="text-bc6 text-pai-300 h-6">로그인</p>
        </Link>
      </div>
      {/* h-[calc(100%-5.75rem)] */}
      <div className="h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide scroll-smooth">
        {/* 모바일 화면 */}
        <div className="flex flex-col mx-auto justify-center items-center h-[400%] box-border">
          {serviceDescription.map((item, index) => {
            return (
              <section
                key={index + item.id}
                className={`h-1/4 w-full ${index === 0 ? "bg-gradient-pai400-fai500-br" : ""}`}
              >
                <div className="mt-20 flex flex-col gap-6">
                  <div
                    className={`text-center text-h1 ${index === 0 ? "text-system-white" : "text-system-black"} flex flex-col gap-3`}
                  >
                    <p>{item.title}</p>
                    <p>{item.subTitle}</p>
                  </div>
                  <div
                    className={`flex flex-col gap-0.5 text-b3 text-center ${index === 0 ? "text-system-white" : "text-system-black"}`}
                  >
                    <p>{item.content}</p>
                    <p>{item.subContent}</p>
                  </div>
                  <div className="w-[343px] h-60 bg-gray-200 mx-auto">
                    {/* 이미지 넣을 자리 Image컴포넌트 사용 필수*/}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
        <div className="h-32 w-full flex flex-col items-center justify-center">
          <div className="flex flex-col gap-3 text-center text-h1 gradient-text-pai400-fai500-br">
            <p>파이와 함께할</p>
            <p>준비가 되셨나요?</p>
          </div>
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
