import { create } from 'zustand';
import { zustandStorage } from './mmkv-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { addLibraryItem } from '@/apiCalls/supaWorker';

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
/* tempt triger to store to supabase
      addHistoryItem: (story, image, title) =>
        set((state) => {
          const newHistory = [{ story, image, title, dateSaved: new Date() }, ...state.history];
          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory.pop(); // Remove the oldest item if history exceeds the maximum size
          }
          return { history: newHistory };
        }),
*/
      addHistoryItem: (story, image, title) => {
        const newHistoryItem = { story, image, title, dateSaved: new Date() };

        // Trigger the addLibraryItem function to save the item in Supabase
        addLibraryItem({
          story,
          image,
          title,
          date: new Date(), // Make sure this matches the format expected by Supabase
          audio_file_url: 'url to autio file', // Add appropriate value if necessary
        }).then((result) => {
          if (result.success) {
            console.log('Item successfully added to Supabase:');
          } else {
            console.log('Failed to add item to Supabase:', result.msg);
          }
        });

        // Update the state
        set((state) => {
          const newHistory = [newHistoryItem, ...state.history];
          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory.pop(); // Remove the oldest item if history exceeds the maximum size
          }
          return { history: newHistory };
        });
      },
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
