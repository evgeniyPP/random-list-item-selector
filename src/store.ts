import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'ru';

interface State {
  isDarkMode: boolean;
  lang: Lang;
  filename: string;
  list: string[];
  itemsPerSelect: number;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setLang: (lang: Lang) => void;
  setFilename: (filename: string) => void;
  setList: (list: string[]) => void;
  setItemsPerSelect: (itemsPerSelect: number) => void;
  clear: () => void;
}

export const useStore = create<State>()(
  persist(
    set => ({
      isDarkMode: false,
      lang: 'en',
      filename: '',
      list: [],
      itemsPerSelect: 1,
      setIsDarkMode: isDarkMode => set({ isDarkMode }),
      setLang: lang => set({ lang }),
      setFilename: filename => set({ filename }),
      setList: list => set({ list }),
      setItemsPerSelect: itemsPerSelect => set({ itemsPerSelect }),
      clear: () => set({ filename: '', list: [], itemsPerSelect: 1 }),
    }),
    { name: 'random-list-item-selector-store' }
  )
);
