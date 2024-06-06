import { create } from "zustand";
import { zustandStorage } from "./mmkv-storage";
import { createJSONStorage, persist } from "zustand/middleware";

interface HistoryItem {
  story: string;
  image: string;
  title: string;
  dateSaved: Date;
}

interface HistoryStore {
  history: HistoryItem[];
  addHistoryItem: (story: string, image: string, title: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addHistoryItem: (story, image, title) => 
        set((state) => ({
          history: [
            ...state.history, 
            { story, image, title, dateSaved: new Date() }
          ],
        })),
      clearHistory: () =>
        set({
          history: [],
        }),
    }),
    {
      name: "history-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
