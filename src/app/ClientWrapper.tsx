"use client";

import Providers from "./_providers";
import PathObserver from "./(main)/diary/_components/PathObserver";
import { useVhFix } from "@/hooks/useVhFix";
import Image from "next/image";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useVhFix();

  return (
    <>
      <div className="full-height w-screen flex">
        <PathObserver />

        {/* 모바일 레이아웃 */}
        <div className="w-full flex flex-col desktop:hidden">
          <Providers>{children}</Providers>
        </div>

        {/* 데스크톱 레이아웃 */}
        <div className="hidden desktop:flex w-full">
          <div className="w-[636px] flex-shrink-0 z-[1000] bg-system-white">
            <Image
              src="/desktopLayoutImage.svg"
              alt="데스크탑 레이아웃 이미지"
              width={636}
              height={1024}
              priority
              layout="responsive"
            />
          </div>
          <div className="full-height flex flex-col flex-grow">
            <Providers>{children}</Providers>
          </div>
        </div>
      </div>
    </>
  );
}
