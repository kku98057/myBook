import { create } from 'zustand';
import { pageState } from '../types/pageTypes';

export const usePageStore = create<pageState>((set) => ({
  page: 0,
  nextPage: (by) => set((state) => ({ page: state.page + by })),
  prevPage: (by) => set((state) => ({ page: state.page - by })),
}));
