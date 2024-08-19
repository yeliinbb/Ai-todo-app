"use client";
import usePageCheck from "@/hooks/usePageCheck";
import Image from "next/image";

type LogoType = "main" | "pai" | "fai";

interface LogoProps {
  type: LogoType;
  className?: string;
  sizes?: string;
}

const Logo = ({ type, className, sizes }: LogoProps) => {
  const imageSrc = {
    main: "/main.logo.svg",
    pai: "/pai.svg",
    fai: "/fai.svg"
  }[type];

  return (
    <Image
      src={imageSrc}
      width={62}
      height={32}
      alt="logo"
      priority
      className={`w-[62px] h-[32px] desktop:w-[93px] desktop:h-[48px] ${className}`}
      sizes={sizes || "(max-width: 1199px) 62px, 124px"}
    />
  );
};

export default Logo;
