import React, { PropsWithChildren } from "react";
import Header from "./_components/Header";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto md:px-12 sm:px-6">
      <Header />
      {children}
    </div>
  );
};

export default AuthLayout;
