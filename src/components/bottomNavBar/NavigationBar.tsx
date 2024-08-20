"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import ChatbotTap from "../icons/navigationBarIcons/ChatbotTap";
import DiaryTap from "../icons/navigationBarIcons/DiaryTap";
import MypageTap from "../icons/navigationBarIcons/MypageTap";
import TodolistTap from "../icons/navigationBarIcons/TodolistTap";
import { usePathname, useRouter } from "next/navigation";

const NavigationIcon = [
  { component: MypageTap, key: "Home", path: "/home" },
  { component: ChatbotTap, key: "Chatbot", path: "/chat" },
  { component: TodolistTap, key: "Todo", path: "/todo-list" },
  { component: DiaryTap, key: "Diary", path: "/diary" }
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
    router.prefetch("/todo-list");
    router.prefetch("/diary");
  }, [router]);

  useLayoutEffect(() => {
    const currentIndex = NavigationIcon.findIndex(({ path }) => path === pathname);
    if (currentIndex !== -1 && currentIndex !== selectedIcon) {
      setSelectedIcon(currentIndex);
    }
  }, [pathname, selectedIcon]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 w-full pb-safe">
      <div className="w-[calc(100%-2rem)] min-w-[calc(100%-2rem)] mx-auto max-w-[calc(100%-506px)] desktop:max-w-[calc(100%-506px)] desktop:min-w-[48.625rem] h-[4.75rem] rounded-full items-center bg-grayTrans-90020 backdrop-blur-3xl shadow-inner p-1">
        <nav className="h-full">
          <ul className="flex justify-between h-full items-center">
            {NavigationIcon.map(({ component: Icon, key, path }, index) => (
              <li
                key={key}
                className={`w-1/4 h-full rounded-full flex items-center justify-center transition-all duration-300 ease-in-out relative cursor-pointer ${
                  selectedIcon === index
                    ? "w-full max-h-[4.3rem] bg-gradient-pai400-fai500-br"
                    : "max-w-[4.3rem] max-h-[4.3rem] min-w-[4.3rem] min-h-[4.3rem] bg-[#f4f4f4f3]"
                }`}
                onClick={() => {
                  handleNavigation(index, path);
                }}
              >
                <div className="flex items-center justify-center gap-2 ">
                  <Icon isSelected={selectedIcon === index} />
                  {selectedIcon === index ? <p className="text-sh3 text-system-white">{key}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavigationBar;
