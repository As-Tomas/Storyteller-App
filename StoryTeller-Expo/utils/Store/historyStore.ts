import { create } from 'zustand';
import { zustandStorage } from './mmkv-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface HistoryItem {
  story: string;
  image: string;
  title: string;
  dateSaved: Date;
}

interface HistoryStore {
  history: HistoryItem[];
  addHistoryItem: (story: string, image: string, title: string) => void;
  removeHistoryItem: (index: number) => void;
  clearHistory: () => void;
  // doubleHistory: () => void;
}
const MAX_HISTORY_SIZE = 200;

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addHistoryItem: (story, image, title) =>
        set((state) => {
          const newHistory = [{ story, image, title, dateSaved: new Date() }, ...state.history];
          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory.pop(); // Remove the oldest item if history exceeds the maximum size
          }
          return { history: newHistory };
        }),
      removeHistoryItem: (index) =>
        set((state) => ({
          history: state.history.filter((_, i) => i !== index),
        })),
      clearHistory: () =>
        set({
          history: [],
        }),
        // doubleHistory: () =>          
        //   set((state) => ({
        //     history: [...state.history, ...state.history],
        //   })),
    }),
    {
      name: 'history-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
