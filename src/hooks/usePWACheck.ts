import { useEffect, useState } from "react";

interface PWAStatus {
  isPWA: boolean;
  isMobilePWA: boolean;
  isDesktopPWA: boolean;
  platform: string;
}

const usePWACheck = () => {
  const [pwaStatus, setPWAStatus] = useState<PWAStatus>({
    isPWA: false,
    isMobilePWA: false,
    isDesktopPWA: false,
    platform: "unknown"
  });

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isPWA = isStandalone || isInWebAppiOS;

      const ua = navigator.userAgent;
      let platform = "unknown";

      if (/iPhone|iPad|iPod/.test(ua)) {
        platform = "ios";
      } else if (/Android/.test(ua)) {
        platform = "android";
      } else if (/Windows/.test(ua)) {
        platform = "windows";
      } else if (/Mac/.test(ua)) {
        platform = "mac";
      } else if (/Linux/.test(ua)) {
        platform = "linux";
      }

      const isMobile = platform === "ios" || platform === "android";

      setPWAStatus({
        isPWA,
        isMobilePWA: isPWA && isMobile,
        isDesktopPWA: isPWA && !isMobile,
        platform
      });
    };

    checkPWA();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => checkPWA();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return pwaStatus;
};

export default usePWACheck;
