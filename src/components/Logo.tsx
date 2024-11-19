"use client";
import usePageCheck from "@/hooks/usePageCheck";
import Image from "next/image";

type LogoType = "main" | "pai" | "fai";
type LogoSize = "default" | "custom";
interface LogoProps {
  type: LogoType;
  className?: string;
  sizes?: string;
  size?: LogoSize;
  width?: string;
  height?: string;
}

const Logo = ({ type, className, sizes, size = "default", width, height }: LogoProps) => {
  const imageSrc = {
    main: "/logo/main.logo.svg",
    pai: "/logo/pai.svg",
    fai: "/logo/fai.svg"
  }[type];

  const defaultSizes = "w-[62px] h-[32px] desktop:w-[93px] desktop:h-[48px]";
  const containerClass =
    size === "default" ? defaultSizes : width && height ? `w-[${width}] h-[${height}]` : "w-full h-full";

  return (
    <div className={`w-full h-full max-w-[62px] flex items-center justify-center ${className}`}>
      <div className={`relative ${containerClass}`}>
        <Image
          src={imageSrc}
          fill
          alt="logo"
          priority
          className="object-contain"
          sizes={size === "default" ? "(max-width: 1199px) 62px, 93px" : sizes || "100vw"}
        />
      </div>
    </div>
  );
};

export default Logo;
