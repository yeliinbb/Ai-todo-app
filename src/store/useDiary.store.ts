import { create } from "zustand";
import { setCookie, getCookie } from "cookies-next";
import { TodoListType } from "@/types/diary.type";
import { get } from "http";

const COOKIE_NAME = "diary_state";

interface DiaryState {
  diary_Id: string;
  title: string;
  content: string;
  todos: TodoListType[];
  fetchingTodos: boolean;
  setDiaryId: (id: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTodos: (todos: TodoListType[]) => void;
  setFetchingTodos: (fetching: boolean) => void;
  resetState: () => void;
}

const loadInitialState = () => {
  const cookieData = getCookie(COOKIE_NAME);
  if (cookieData) {
    return JSON.parse(cookieData as string);
  }
  return {
    diary_Id: "",
    title: "",
    content: "",
    todos: [],
    fetchingTodos: false
  };
};

export const useDiaryStore = create<DiaryState>((set) => ({
  ...loadInitialState(),
  setDiaryId: (id) =>
    set((state) => {
      if (state.diary_Id !== id) {
        const newState = { ...state, diary_Id: id };
        setCookie(COOKIE_NAME, JSON.stringify(newState));
        return newState;
      }
      return state;
    }),
  setTitle: (title) =>
    set((state) => {
      if (state.title !== title) {
        const newState = { ...state, title };
        setCookie(COOKIE_NAME, JSON.stringify(newState));
        return newState;
      }
      return state;
    }),
  setContent: (content) =>
    set((state) => {
      if (state.content !== content) {
        const newState = { ...state, content };
        setCookie(COOKIE_NAME, JSON.stringify(newState));
        return newState;
      }
      return state;
    }),
  setTodos: (todos) =>
    set((state) => {
      if (state.todos !== todos) {
        const newState = { ...state, todos };
        setCookie(COOKIE_NAME, JSON.stringify(newState));
        return newState;
      }
      return state;
    }),
  setFetchingTodos: (fetching) =>
    set((state) => {
      if (state.fetchingTodos !== fetching) {
        const newState = { ...state, fetchingTodos: fetching };
        setCookie(COOKIE_NAME, JSON.stringify(newState));
        return newState;
      }
      return state;
    }),
  resetState: () => {
    set({ diary_Id: "", title: "", content: "", todos: [], fetchingTodos: false });
    setCookie(COOKIE_NAME, "");
  }
}));
