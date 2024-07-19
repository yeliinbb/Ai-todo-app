import React, { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <div className="w-full max-w-[1280px] mx-auto  md:px-12 sm:px-6">{children}</div>;
};

export default AuthLayout;
