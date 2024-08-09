import { PropsWithChildren } from "react";
import AccountHeader from "./my-page/_components/AccountHeader";

const NonHeaderLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className=" w-full flex flex-col bg-grayTrans-20032">
      <AccountHeader />
      <div className="flex flex-col flex-grow relative overflow-auto">{children}</div>
    </div>
  );
};

export default NonHeaderLayout;
