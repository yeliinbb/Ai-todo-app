import { PropsWithChildren } from "react";
import AuthHeader from "./_components/AuthHeader";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full max-w-screen-desktop mx-auto md:px-12 sm:px-6">
      <AuthHeader />
      {children}
    </div>
  );
};

export default AuthLayout;
