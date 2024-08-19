import { PropsWithChildren } from "react";
import AccountHeader from "./my-page/_components/AccountHeader";

const NonHeaderLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className=" w-full flex flex-col bg-gray-100 h-full overflow-hidden">
      <AccountHeader />
      <div className="flex flex-col flex-grow relative overflow-y-auto scrollbar-hide scroll-smooth">{children}</div>
    </div>
  );
};

export default NonHeaderLayout;
