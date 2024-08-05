import { create } from "zustand";

type SideNavStore = {
  isSideNavOpen: boolean;
  toggleSideNav: () => void;
  handleClose: () => void;
};

const useSideNavStore = create<SideNavStore>((set) => ({
  isSideNavOpen: false,
  toggleSideNav: () =>
    set((state) => ({
      isSideNavOpen: !state.isSideNavOpen
    })),
  handleClose: () => set({ isSideNavOpen: false })
}));

export default useSideNavStore;
