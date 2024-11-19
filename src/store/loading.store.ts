import { create } from "zustand";

interface UseLoadingType {
  nowLoading: boolean;
  setNowLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<UseLoadingType>((set) => ({
  nowLoading: false,
  setNowLoading: (loading) => set({ nowLoading: loading })
}));
