import { useCallback, useRef } from "react";

export function useThrottle() {
  const lastRun = useRef<number>(Date.now());
  return useCallback((callback: () => Promise<void>, delay: number) => {
    const timeElapsed = Date.now() - lastRun.current;

    if (timeElapsed >= delay) {
      callback();
      lastRun.current = Date.now();
    }
  }, []);
}

// export function useThrottle(callback: () => void, delay: number) {
//   const lastRun = useRef<number>(Date.now());
//   return () => {
//     const timeElapsed = Date.now() - lastRun.current;

//     if (timeElapsed >= delay) {
//       callback();
//       lastRun.current = Date.now();
//     }
//   };
// }
