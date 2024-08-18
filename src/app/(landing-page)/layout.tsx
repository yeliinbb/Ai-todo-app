import Image from "next/image";
import { PropsWithChildren } from "react";

const LandingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default LandingLayout;
