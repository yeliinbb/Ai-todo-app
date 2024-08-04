import { PropsWithChildren } from "react";
import AccountHeader from "../_components/AccountHeader";

const AccountLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <AccountHeader />
      {children}
    </div>
  );
};

export default AccountLayout;
