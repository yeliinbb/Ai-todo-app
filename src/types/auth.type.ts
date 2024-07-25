import { Json } from "./supabase";

export type Auth = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  ai_type: string;
};

export type AuthStoreType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  ai_type: string;
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

export type UserDataType = {
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: Json | null;
    user_metadata: {
      avatar_url: string;
      email: string;
      email_verified: boolean;
      full_name: string;
      iss: string;
      name: string;
      phone_verified: boolean;
      picture: string;
      provider_id: string;
      sub: string;
    };
    identities: Json | null;
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
  };
};
