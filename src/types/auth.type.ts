import { Json } from "./supabase";

export type Auth = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  ai_type: string;
  isOAuth: boolean;
};

export type AuthStoreType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  ai_type: string;
  isOAuth: boolean;
  error: {
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setError: (error: Partial<AuthStoreType["error"]>) => void;
};
