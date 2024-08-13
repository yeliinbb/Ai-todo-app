"use client";

import Providers from "./_providers";
import PathObserver from "./(main)/diary/_components/PathObserver";
import { useVhFix } from "@/hooks/useVhFix";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useVhFix();

  return (
    <div className="full-height flex flex-col">
      <PathObserver />
      <Providers>{children}</Providers>
    </div>
  );
}
