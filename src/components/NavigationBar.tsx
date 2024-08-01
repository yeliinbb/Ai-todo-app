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
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 right-0 h-[92px] mb-[21px] z-10 max-w-min">
      <div className="mobile:w-[calc(100%-32px)] mobile:mx-auto desktop:w-[500px] desktop:mx-auto h-[76px]  rounded-full items-center bg-system-error p-1">
        <nav className="h-full">
          <ul className="flex justify-between h-full">
            {NavigationIcon.map(({ component: Icon, key, path }, index) => (
              <li
                key={key}
                className={`w-1/4 h-full rounded-full flex items-center justify-center transition-all duration-300 ease-in-out relative ${
                  selectedIcon === index ? "w-[125px] bg-gradient-pai400-fai500-br" : "w-[68px] h-[68px] bg-[#EAEAEA]"
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
