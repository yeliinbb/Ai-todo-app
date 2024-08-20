"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useUserData } from "@/hooks/useUserData";
import AddFABtn from "@/shared/ui/AddFABtn";
import WriteDiaryBtn from "./WriteDiaryBtn";
import WriteTodoBtn from "./WriteTodoBtn";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/useModal";
import AddTodoDrawer from "@/todos/components/AddTodoDrawer";
import { useTodos } from "@/todos/useTodos";
import dayjs from "dayjs";
import { TodoFormData } from "@/todos/components/TodoForm";
import { AI_TYPES } from "@/lib/constants/aiTypes";
import ChatCard from "./ChatCard";
import ResponsiveBanner from "./ResponsiveBanner";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  const router = useRouter();
  const { data } = useUserData();
  const user = data || null;
  const userId = user?.user_id;
  const { openModal, Modal } = useModal();
  const [isHome, setIsHome] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const conditionalDefaultClass = isVisible ? "bg-gradient-pai600-fai700-br" : "bg-gradient-pai400-fai500-br";

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { addTodo } = useTodos(userId!);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleClickBtn = (index: number) => {
    if (!user) {
      openModal(
        {
          message: "로그인 이후 사용가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
          confirmButton: { text: "확인", style: "시스템" }
        },
        () => router.push("/login")
      );
      return;
    }

    if (index === 0) {
      router.push("/diary/write-diary");
      return;
    } else if (index === 1) {
      setIsOpen((prev) => !prev);
      return;
    }
  };

  const buttonList = [
    {
      Component: WriteDiaryBtn,
      onClick: (index: number) => handleClickBtn(index)
    },
    {
      Component: WriteTodoBtn,
      onClick: (index: number) => handleClickBtn(index)
    }
  ];

  const handleAddTodoSubmit = async (data: TodoFormData): Promise<void> => {
    router.push("/todo-list");

    const eventDateTime = data.eventTime
      ? dayjs(selectedDate).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : dayjs(selectedDate).set("hour", 0).set("minute", 0).toISOString();

    await addTodo({
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      address: data.address,
      is_chat: false,
      is_all_day_event: data.eventTime === null
    });
  };

  useEffect(() => {
    const hasVisited = getCookie("visitedMainPage");
    if (!hasVisited) {
      setCookie("visitedMainPage", true, { maxAge: 60 * 60 * 24 * 30 });
    }
    // eslint-disable-next-line
  }, []);

  // 데스크톱에서의 왼쪽 고정 영역 너비 계산
  const leftColumnWidth = isDesktop ? `calc(21.75rem + (100vw - 1200px) * 0.325)` : "0px";

  const contentWidth = isDesktop ? `calc(100vw - ${leftColumnWidth})` : "100%";

  return (
    <div className="w-full h-full flex flex-col items-center pt-[4.5rem] desktop:pt-[5.375rem]">
      <Modal />
      <ResponsiveBanner />
      <div className="px-4 desktop:px-[3.25rem] flex flex-col w-full h-full" style={{ maxWidth: contentWidth }}>
        <h1 className="desktop:text-sh1 desktop:my-10 my-5 text-center text-sh4 text-transparent bg-clip-text bg-gradient-pai400-fai500-br">
          오늘은 어떤 기록을 함께 할까요?
        </h1>
        <div className="desktop:gap-[2.5rem] flex gap-[0.563rem] " style={{ maxWidth: contentWidth }}>
          {AI_TYPES.map((aiType) => (
            <ChatCard key={aiType} aiType={aiType} />
          ))}
        </div>
        <div className="relative w-full" style={{ maxWidth: contentWidth }}>
          <Image
            src={"/bannerHome2-Mobile.png"}
            layout="responsive"
            width={343}
            height={106}
            alt="홈에서도 가능한 투두와 다이어리 작성!"
            priority
            sizes={`(max-width: 1199px) 100vw, ${contentWidth}`}
            className="desktop:hidden block mt-5 mb-[9.75rem] w-full h-auto"
          />
          <Image
            src={"/bannerHome2-PC.png"}
            layout="responsive"
            width={1180}
            height={160}
            alt="홈에서도 가능한 투두와 다이어리 작성!"
            priority
            sizes={`(min-width: 1200px) ${contentWidth}, 100vw`}
            className="desktop:mb-[10.5rem] hidden mt-12 desktop:block mb-[9.75rem]"
          />
        </div>
      </div>
      <div
        style={{ transform: "translate3d(0,0,0)" }}
        className={`transform duration-300 ease-out ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-0 opacity-0"
        } flex flex-col justify-start items-center fixed bottom-[76px] right-0 w-[60px] h-[188px] bg-grayTrans-90020 rounded-full m-4 pt-1.5 gap-2.5`}
      >
        {buttonList.map((button, index) => (
          <div key={index} onClick={() => button.onClick(index)} className="hover:cursor-pointer">
            <button.Component />
          </div>
        ))}
      </div>
      <AddFABtn
        onClick={handleToggle}
        defaultClass={conditionalDefaultClass}
        hoverClass="hover:bg-pai-400 hover:border-pai-600 hover:border-2"
        pressClass="active:bg-gradient-pai600-fai700-br"
      />
      <AddTodoDrawer
        selectedDate={selectedDate}
        onSubmit={handleAddTodoSubmit}
        isHome={isHome}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Home;
