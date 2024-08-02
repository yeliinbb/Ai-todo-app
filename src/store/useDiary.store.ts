import { create } from "zustand";
import { setCookie, getCookie } from "cookies-next";
import { TodoListType } from "@/types/diary.type";

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
  loadFromCookies: () => void;
  saveToCookies: () => void;
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

export const useDiaryStore = create<DiaryState>((set, get) => ({
  ...loadInitialState(),
  setDiaryId: (id) => set({ diary_Id: id }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTodos: (todos) => set({ todos }),
  setFetchingTodos: (fetching) => set({ fetchingTodos: fetching }),
  loadFromCookies: () => {
    const cookieData = getCookie(COOKIE_NAME);
    if (cookieData) {
      const state = JSON.parse(cookieData as string);
      set(state);
    }
  },
  saveToCookies: () => {
    const state = get();
    setCookie(
      COOKIE_NAME,
      JSON.stringify({
        diary_Id: state.diary_Id,
        title: state.title,
        content: state.content,
        todos: state.todos,
        fetchingTodos: state.fetchingTodos
      })
    );
  },
  resetState: () => {
    set({ diary_Id: "", title: "", content: "", todos: [], fetchingTodos: false });
    setCookie(COOKIE_NAME, "");
  }
}));
