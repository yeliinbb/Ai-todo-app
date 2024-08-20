import { PropsWithChildren } from "react";
import AuthHeader from "./_components/AuthHeader";

// className="w-full mx-auto md:px-12 sm:px-6"

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-y-auto scrollbar-hide scroll-smooth">
      <AuthHeader />
      <div className="flex flex-col flex-grow relative">{children}</div>
    </div>
  );
};

export default AuthLayout;
