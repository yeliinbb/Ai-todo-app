export type Auth = {
  user_id?: string;
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isOAuth: boolean;
};

export type AuthStoreType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isOAuth: boolean;
  error: {
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
    loginFailed: string;
  };

  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setError: (error: Partial<AuthStoreType["error"]>) => void;
};
