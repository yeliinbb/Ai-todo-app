import { AuthStoreType } from "@/types/auth.type";
import { create } from "zustand";

export const useAuthStore = create<AuthStoreType>((set) => ({
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  ai_type: "Pai",
  isOAuth: false,
  error: {
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: ""
  },

  setNickname: (nickname) => set({ nickname }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setPasswordConfirm: (passwordConfirm) => set({ passwordConfirm }),
  setError: (error) => set((state) => ({ error: { ...state.error, ...error } }))
}));
