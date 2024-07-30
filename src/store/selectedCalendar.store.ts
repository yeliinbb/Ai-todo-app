import { getCookie, setCookie } from "cookies-next";
import { create } from "zustand";

interface StoreState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const COOKIE_NAME = "selectedDate";

const useselectedCalendarStore = create<StoreState>((set) => ({
  selectedDate: 
    (typeof window !== 'undefined' ? getCookie(COOKIE_NAME) : null) as string || 
    new Date().toISOString().split("T")[0],
  
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    setCookie(COOKIE_NAME, date, { 
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30일동안 유효
      sameSite: "strict"
    });
  }
}));

export default useselectedCalendarStore;