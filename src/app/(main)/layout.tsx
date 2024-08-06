import React, { PropsWithChildren } from "react";
import NavBarWrapper from "@/components/NavBarWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";
import dynamic from "next/dynamic";
import SideNavBar from "@/components/SideNavBar";

// 해당 컴포넌트가 무거울 경우 성능 개선을 위해 서버 사이드에서 렌더링 하지 않기 위해 동적 import
// const NavbarWrapper = dynamic(() => import("@/components/NavbarWrapper"), {
//   ssr: false
// });

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="h-screen w-full flex flex-col bg-gray-100">
      <HeaderWrapper />
      <div className="flex flex-col flex-grow overflow-hidden">
        <SideNavBar />
        <div className="flex-grow overflow-y-auto">{children}</div>
        <NavBarWrapper />
      </div>
    </main>
  );
};

export default MainLayout;
