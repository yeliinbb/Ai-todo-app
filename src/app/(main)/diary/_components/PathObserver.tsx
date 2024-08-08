"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useSelectedCalendarStore from "@/store/selectedCalendar.store";

const PathObserver: React.FC = () => {
  const pathname = usePathname();
  const { setLastVisitedPath, resetDate } = useSelectedCalendarStore();
  useEffect(() => {
    const handlePathChange = () => {
      setLastVisitedPath((prevPath) => {
        if (!prevPath.startsWith("/diary") && pathname.startsWith("/diary")) {
          resetDate();
        }
        return pathname;
      });
    };

    handlePathChange();
  }, [pathname, setLastVisitedPath, resetDate]);

  return null;
};

export default PathObserver;
