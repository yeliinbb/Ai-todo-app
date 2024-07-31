"use client";

import { useRef } from "react";

export function useThrottle(callback: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>, delay: number) {
  const lastRun = useRef<number>(Date.now());
  return (e?: React.FormEvent<HTMLFormElement>) => {
    const timeElapsed = Date.now() - lastRun.current;

    if (timeElapsed >= delay) {
      callback(e);
      lastRun.current = Date.now();
    }
  };
}
