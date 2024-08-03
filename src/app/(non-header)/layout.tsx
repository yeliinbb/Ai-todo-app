import { PropsWithChildren } from "react";

const NonHeaderLayout = ({ children }: PropsWithChildren) => {
  return <div className="h-screen w-full flex flex-col">{children}</div>;
};

export default NonHeaderLayout;

//h-screen w-full flex flex-col
//w-full max-w-[1280px] mx-auto md:px-12 sm:px-6 mobile:w-[343px]
