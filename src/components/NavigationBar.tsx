"use client";
import { useEffect, useState } from "react";
import ChatbotTap from "./icons/navigationBarIcons/ChatbotTap";
import DiaryTap from "./icons/navigationBarIcons/DiaryTap";
import MypageTap from "./icons/navigationBarIcons/MypageTap";
import TodolistTap from "./icons/navigationBarIcons/TodolistTap";
import { usePathname, useRouter } from "next/navigation";

const NavigationIcon = [
  { component: TodolistTap, key: "todolist", path: "/todo-list" },
  { component: ChatbotTap, key: "chatbot", path: "/chat" },
  { component: DiaryTap, key: "diary", path: "/diary" },
  { component: MypageTap, key: "mypage", path: "/my-page" }
];

const NavigationBar = () => {
  const [selectedIcon, setSelectedIcon] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (index: number, path: string) => {
    setSelectedIcon(index);
    router.push(path);
  };

  useEffect(() => {
    const currentIndex = NavigationIcon.findIndex(({ path }) => path === pathname);
    if (currentIndex !== -1) {
      setSelectedIcon(currentIndex);
    }
  }, [pathname]);

  return (
    <div className="w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 right-0 h-20 mb-5 z-10">
      <div className="w-[calc(100%-32px)] mobile:mx-auto desktop:w-[500px] desktop:mx-auto h-[76px]  rounded-full items-center bg-grayTrans-90020 backdrop-blur-3xl shadow-inner p-1">
        <nav className="h-full">
          <ul className="flex justify-between h-full">
            {NavigationIcon.map(({ component: Icon, key, path }, index) => (
              <li
                key={key}
                className={`w-1/4 h-full rounded-full flex items-center justify-center transition-all duration-300 ease-in-out relative ${
                  selectedIcon === index
                    ? "w-full bg-gradient-pai400-fai500-br"
                    : "max-w-16 max-h-16 min-w-16 min-h-16 bg-[#f4f4f4f3]"
                }`}
                onClick={() => {
                  handleNavigation(index, path);
                }}
              >
                <Icon isSelected={selectedIcon === index} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavigationBar;
