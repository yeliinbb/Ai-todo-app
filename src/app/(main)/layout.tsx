import React, { PropsWithChildren } from "react";
import NavBarWrapper from "@/components/NavBarWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <HeaderWrapper />
      <main>{children}</main>
      <NavBarWrapper />
    </>
  );
};

export default MainLayout;
