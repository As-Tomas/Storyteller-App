import { create } from 'zustand';
import { zustandStorage } from './mmkv-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LibraryItem {
  id: number;
  story: string;
  image: string;
  title: string;
  date: Date;
  audioData: string;
}

interface LibraryStoryState {
  libStory: LibraryItem;
  setLibStory: (libStory: LibraryItem) => void;
}

export const useLibraryStoryStore = create<LibraryStoryState>()(
  persist(
    (set) => ({
      libStory: { id: 0, story: '', image: '', title: '', date: new Date(), audioData: '' },
      setLibStory: (libStory) => set({ libStory }),
    }),
    {
      name: 'library-story-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
