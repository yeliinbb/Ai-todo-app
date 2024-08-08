// import { getCookie, setCookie } from "cookies-next";
// import { create } from "zustand";

// interface StoreState {
//   selectedDate: string;
//   setSelectedDate: (date: string) => void;
// }

// const COOKIE_NAME = "selectedDate";

// const useselectedCalendarStore = create<StoreState>((set) => ({
//   selectedDate:
//     (typeof window !== 'undefined' ? getCookie(COOKIE_NAME) : null) as string ||
//     new Date().toISOString().split("T")[0],

//   setSelectedDate: (date: string) => {
//     set({ selectedDate: date });
//     setCookie(COOKIE_NAME, date, {
//       path: "/",
//       maxAge: 30 * 24 * 60 * 60, // 30일동안 유효
//       sameSite: "strict"
//     });
//   }
// }));

// export default useselectedCalendarStore;

// store/useSelectedCalendarStore.ts
import { getCookie, setCookie } from "cookies-next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  resetDate: () => void;
  lastVisitedPath: string;
  setLastVisitedPath: (path: (prevPath: string) => string) => void;
}

const COOKIE_NAME = "selectedDate";

const useSelectedCalendarStore = create<StoreState>()(
  persist(
    (set, get) => ({
      selectedDate:
        ((typeof window !== "undefined" ? getCookie(COOKIE_NAME) : null) as string) ||
        new Date().toISOString().split("T")[0],

      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
        setCookie(COOKIE_NAME, date, {
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
          sameSite: "strict"
        });
      },

      resetDate: () => {
        const today = new Date().toISOString().split("T")[0];
        set({ selectedDate: today });
        setCookie(COOKIE_NAME, today, {
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
          sameSite: "strict"
        });
      },

      lastVisitedPath: "/",
      setLastVisitedPath: (pathUpdater) => {
        set((state) => ({ lastVisitedPath: pathUpdater(state.lastVisitedPath) }));
      }
    }),
    {
      name: "selected-calendar-store",
      partialize: (state) => ({ lastVisitedPath: state.lastVisitedPath })
    }
  )
);

export default useSelectedCalendarStore;
