import React, { PropsWithChildren } from "react";
import NavBarWrapper from "@/components/bottomNavBar/NavBarWrapper";
import HeaderWrapper from "@/components/header/HeaderWrapper";
import dynamic from "next/dynamic";
import SideNavBar from "@/components/sideNavBar/SideNavBar";

// 해당 컴포넌트가 무거울 경우 성능 개선을 위해 서버 사이드에서 렌더링 하지 않기 위해 동적 import
// const NavbarWrapper = dynamic(() => import("@/components/bottomNavBar/NavBarWrapper"), {
//   ssr: false
// });

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="h-screen-safe flex flex-col overflow-y-scroll scrollbar-hide scroll-smooth">
      <HeaderWrapper />
      <div className="flex flex-col flex-grow  pt-[4.5rem] relative">
        <SideNavBar />
        <div className="flex-grow">{children}</div>
        <NavBarWrapper />
      </div>
    </main>
  );
};

export default MainLayout;
