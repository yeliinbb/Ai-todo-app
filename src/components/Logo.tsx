"use client";
import usePageCheck from "@/hooks/usePageCheck";
import Image from "next/image";

interface LogoProps {
  isFai?: boolean;
}

const Logo = ({ isFai }: LogoProps) => {
  const { isPaiPage, isFaiPage } = usePageCheck();
  const imageSrc = isPaiPage || isFaiPage ? (isFai ? "/fai.svg" : "/pai.svg") : "/main.logo.svg";
  return (
    <>
      <Image src={imageSrc} width={62} height={32} alt="logo" priority />
    </>
  );
};

export default Logo;
