import { PropsWithChildren, Suspense } from "react";
import AuthHeader from "./_components/AuthHeader";
import Loading from "../loading/loading";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="h-screen w-full bg-gray-100 flex flex-col overflow-y-auto scrollbar-hide scroll-smooth">
        <AuthHeader />
        <div className="flex flex-col flex-grow relative">{children}</div>
      </div>
    </Suspense>
  );
};

export default AuthLayout;
