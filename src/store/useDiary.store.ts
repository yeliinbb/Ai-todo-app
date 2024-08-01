import { create } from "zustand";
import { setCookie, getCookie } from "cookies-next";
import { TodoListType } from "@/types/diary.type";

interface DiaryState {
  diaryId: string;
  title: string;
  content: string;
  todos: TodoListType[];
  previousPath: string;
  setPreviousPath: (path: string) => void;
  setDiaryId: (id: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTodos: (todos: TodoListType[]) => void;
  resetDiary: () => void;
  loadFromCookies: () => void;
  saveToCookies: () => void;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diaryId: "",
  title: "",
  content: "",
  todos: [],
  previousPath: "",

  setDiaryId: (id) => set({ diaryId: id }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTodos: (todos) => set({ todos }),
  resetDiary: () => {
    set({ diaryId: "", title: "", content: "", todos: [] });
    setCookie("diaryState", JSON.stringify({ diaryId: "", title: "", content: "", todos: [] }));
  },
  loadFromCookies: () => {
    const cookieData = getCookie("diaryState");
    if (cookieData) {
      const { diaryId, title, content, todos } = JSON.parse(cookieData as string);
      set({ diaryId, title, content, todos });
    }
  },
  saveToCookies: () => {
    const { diaryId, title, content, todos } = get();
    setCookie("diaryState", JSON.stringify({ diaryId, title, content, todos }));
  },
  setPreviousPath: (path) => set({ previousPath: path })
}));
