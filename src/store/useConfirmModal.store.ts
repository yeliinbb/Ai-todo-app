import { create } from "zustand";

interface ModalStore {
  isOpen: boolean;
  message: string;
  buttonName: string;
  openModal: (message: string, buttonName: string) => void;
  closeModal: () => void;
  confirmed: boolean;
  setConfirmed: (status: boolean) => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  message: "",
  buttonName: "",
  openModal: (message, buttonName) => set({ isOpen: true, message, buttonName }),
  closeModal: () => set({ isOpen: false }),
  confirmed: false,
  setConfirmed: (status) => set({ confirmed: status })
}));

export default useModalStore;
