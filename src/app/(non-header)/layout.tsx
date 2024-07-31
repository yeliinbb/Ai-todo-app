import { PropsWithChildren } from "react";

const NonHeaderLayout = ({ children }: PropsWithChildren) => {
  return <div className="w-full max-w-[1280px] mx-auto md:px-12 sm:px-6 mobile:w-[343px]">{children}</div>;
};

export default NonHeaderLayout;
