import { create } from "zustand";
interface StoreState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const useselectedCalendarStore = create<StoreState>((set) => ({
  selectedDate: new Date().toISOString().split("T")[0], // 기본값을 오늘 날짜로 설정
  setSelectedDate: (date: string) => set({ selectedDate: date })
}));

export default useselectedCalendarStore;
