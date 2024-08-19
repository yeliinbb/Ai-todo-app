"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface LandingImgPropsType {
  mobileSrc: string;
  desktopSrc?: string;
}

const LandingImg: React.FC<LandingImgPropsType> = ({ mobileSrc, desktopSrc }) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });
  const [imageSrc, setImageSrc] = useState<string>(mobileSrc);
  useEffect(() => {
    setImageSrc(isDesktop && desktopSrc ? desktopSrc : mobileSrc);
  }, [isDesktop, desktopSrc, mobileSrc]);
  return (
    <div className="w-full h-full relative">
      <Image
        src={imageSrc}
        alt="intro1"
        layout="fill"
        objectFit="contain"
        className="absolute inset-0"
        loader={({ src }) => src}
      />
    </div>
  );
};

export default LandingImg;
