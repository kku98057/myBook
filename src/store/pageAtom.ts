import { create } from 'zustand';
import { pageState } from '../types/pageTypes';

export const usePageStore = create<pageState>((set) => ({
  page: 0,
  nextPage: (by) => set((state) => ({ page: state.page + by })),
  prevPage: (by) => set((state) => ({ page: state.page - by })),
  setPage: (by) => set(() => ({ page: by })),
}));

export const useEnteredStore = create<{ entered: boolean; setEntered: (by: boolean) => void }>(
  (set) => ({
    entered: false,
    setEntered: (by: boolean) => set(() => ({ entered: by })),
  })
);
