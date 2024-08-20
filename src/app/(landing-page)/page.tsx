import Logo from "@/components/Logo";
import FixedActionButton from "./_components/FixedActionButton";
import Link from "next/link";
import LandingImg from "./_components/LandingImg";

type ServiceDescriptionType = {
  id: number;
  title: string;
  subTitle: string;
  content: string;
  subContent: string;
  mobileSrc: string;
  desktopSrc?: string;
};

const serviceDescription: ServiceDescriptionType[] = [
  {
    id: 0,
    title: "AI 챗봇 메이트와",
    subTitle: "함께하는 나의 기록",
    content: "바쁜 일상 속에서",
    subContent: "효율적인 일정 관리와 일기 기록",
    mobileSrc: "/landingIMG/Landing_Img_1_Mobile.png",
    desktopSrc: "/landingIMG/Landing_Img_1_PC.png"
  },
  {
    id: 1,
    title: "Personal Assistant,",
    subTitle: "PAi와 일정 관리",
    content: "음성 인식과 채팅을 통해",
    subContent: "투두리스트를 추천받고 작성해요",
    mobileSrc: "/landingIMG/Landing_Img_2(common).png"
  },
  {
    id: 2,
    title: "Friendly AI,",
    subTitle: "FAi와의 대화를 일기로",
    content: "FAi와 나눈 대화로",
    subContent: "하루를 요약하고 일기로 만들어요.",
    mobileSrc: "/landingIMG/Landing_Img_3(common).png"
  },
  {
    id: 3,
    title: "투두리스트와 일기를",
    subTitle: "캘린더에서 한 눈에 확인",
    content: "상태별 다른 색상으로",
    subContent: "한 눈에 기록 여부를 확인해요.",
    mobileSrc: "/landingIMG/Landing_Img_4(common).png"
  }
];

const LandingPage = () => {
  return (
    <div className="relative h-screen w-full bg-gray-100">
      <div className="flex justify-between items-center w-full absolute top-0 left-1/2 transform -translate-x-1/2 z-20 bg-header-white-gradient desktop:px-[3.25rem] mobile:px-4 mobile:pt-2 desktop:pt-4 mobile:pb-5 desktop:pb-[1.125rem]">
        <div className="desktop:h-12 mobile:h-[2.125rem] w-full flex justify-between items-center">
          <Logo type="main" />
          <div className="flex mobile:gap-2 desktop:gap-3">
            <Link
              href={"/login"}
              className="bg-pai-400 rounded-full mobile:px-4 desktop:px-7 desktop:py-2.5 mobile:py0.5 text-system-white flex flex-col items-center justify-center border-2 border-transparent box-border hover:border-pai-600 desktop:w-[7.5rem] mobile:w-[4.813rem] desktop:h-12 mobile:h-7 transition-all shadow-[0_0_8px_rgba(0,0,0,0.16)]"
            >
              <p className="desktop:text-h6 mobile:text-bc6 mobile:h-6 desktop:h-7">로그인</p>
            </Link>
            <Link
              href={"/sign-up"}
              className="bg-system-white border mobile:border-pai-500 desktop:border-pai-400 rounded-full mobile:px-4 desktop:px-7 desktop:py-2.5 mobile:py0.5 flex flex-col items-center justify-center mobile:text-pai-500 desktop:text-pai-400 box-border hover:outline hover:outline-1 hover:outline-pai-600 hover:border-pai-600 desktop:h-12 mobile:h-7 transition-all shadow-[0_0_8px_rgba(0,0,0,0.16)]"
            >
              <p className="desktop:text-h6 mobile:text-bc6 mobile:h-6 desktop:h-7 ">회원 가입</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="desktop:h-[calc(100%-5.75rem)] mobile:h-[calc(100dvh-5.75rem)] overflow-y-auto scrollbar-hide scroll-smooth ">
        <div
          className={`flex flex-col mx-auto justify-center items-center mobile:h-[400%] desktop:h-[300%] box-border`}
        >
          {serviceDescription.map((item, index) => {
            return (
              <section
                key={index + item.id}
                className={`h-1/4 w-full ${index === 0 ? "gradient-pai400-fai500-br-opacity-60 desktop:pt-[3.875rem]" : ""}  box-border`}
              >
                <div
                  className={`mt-10 grid mobile:grid-rows-[auto_1fr] grid-rows-auto desktop:grid-rows-1  mobile:gap-5 desktop:gap-6 h-[calc(100%-2.5rem)] mobile:py-7 desktop:py-[3.75rem] desktop:w-[calc(100%-6.5rem)] desktop:mx-auto ${
                    index % 2 === 0 ? "desktop:grid-cols-[3fr_7fr]" : "desktop:grid-cols-[7fr_3fr]"
                  }`}
                >
                  <div
                    className={`flex flex-col justify-center mobile:gap-5 ${index % 2 === 0 ? "desktop:order-1" : "desktop:order-2"} mobile:order-1`}
                  >
                    <div
                      className={`mobile:text-center desktop:text-left text-h1 ${index === 0 ? "text-system-white" : "text-system-black"} flex flex-col gap-3 mobile:mt-7`}
                    >
                      <p>{item.title}</p>
                      <p>{item.subTitle}</p>
                    </div>
                    <div
                      className={`flex flex-col gap-0.5 mobile:text-b3 desktop:text-bc1 mobile:text-center desktop:text-left ${index === 0 ? "text-system-white" : "text-system-black"}`}
                    >
                      <p>{item.content}</p>
                      <p>{item.subContent}</p>
                    </div>
                  </div>
                  <div
                    className={`w-[calc(100%-2rem)] mx-auto ${index % 2 === 0 ? "desktop:order-2" : "desktop:order-1"} mobile:order-2 `}
                  >
                    <LandingImg mobileSrc={item.mobileSrc} desktopSrc={item.desktopSrc} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
        <div className="w-full flex flex-col items-center justify-center desktop:py-[3.75rem] desktop:mb-16 mobile:py-7 mobile:mb-[10.25rem]">
          <div className="flex flex-col mobile:gap-3 desktop:gap-5 text-center text-h1 gradient-text-pai400-fai500-br">
            <p>파이와 함께할</p>
            <p>준비가 되셨나요?</p>
          </div>
        </div>
      </div>
      <FixedActionButton />
    </div>
  );
};

export default LandingPage;
