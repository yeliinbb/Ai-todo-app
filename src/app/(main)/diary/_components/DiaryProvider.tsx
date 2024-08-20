'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiaryContextType {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  diaryId: string;
  setDiaryId: (id: string) => void;
  isFetchingTodo: boolean;
  setIsFetchingTodo: (isFetching: boolean) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [diaryId, setDiaryId] = useState<string>('');
  const [isFetchingTodo, setIsFetchingTodo] = useState<boolean>(false);

  return (
    <DiaryContext.Provider value={{ title, setTitle, content, setContent, diaryId, setDiaryId, isFetchingTodo, setIsFetchingTodo }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = (): DiaryContextType => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary 오류');
  }
  return context;
};