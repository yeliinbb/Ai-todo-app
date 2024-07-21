export type Auth = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type AuthStoreType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
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
