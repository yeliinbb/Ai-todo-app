"use client";

import Providers from "./_providers";
import PathObserver from "./(main)/diary/_components/PathObserver";
import { useVhFix } from "@/hooks/useVhFix";
import DesktopLayoutImage from "@/components/DesktopLayoutImage";

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
          <div className="w-[calc(21.75rem+(100vw-1200px)*0.325)] max-w-[39.75rem] min-w-[21.75rem] flex-shrink-0 z-[1000] bg-system-white flex items-center justify-center">
            <div className="w-[21.75rem] h-[41.5rem]">
              <DesktopLayoutImage />
            </div>
          </div>
          <div className="full-height flex flex-col flex-grow">
            <Providers>{children}</Providers>
          </div>
        </div>
      </div>
    </>
  );
}
