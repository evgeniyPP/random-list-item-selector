import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  filename: string;
  list: string[];
  itemsPerSelect: number;
  setFilename: (filename: string) => void;
  setList: (list: string[]) => void;
  setItemsPerSelect: (itemsPerSelect: number) => void;
  clear: () => void;
}

export const useListStore = create<State>()(
  persist(
    set => ({
      filename: '',
      list: [],
      itemsPerSelect: 1,
      setFilename: filename => set({ filename }),
      setList: list => set({ list }),
      setItemsPerSelect: itemsPerSelect => set({ itemsPerSelect }),
      clear: () => set({ filename: '', list: [], itemsPerSelect: 1 }),
    }),
    { name: 'list-store' }
  )
);
