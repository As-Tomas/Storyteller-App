import { create } from 'zustand';
import { zustandStorage } from './mmkv-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsData {
  name: string;
  language: string;
  languageLabel: string;
  age: number;
  length: number;
  motivation: string;
  storyComponents: string;
}

interface SettingsState {
  settingsData: SettingsData;
  recentStory: string;
  recentStoryTitle: string;
  loading: boolean;
  storyImage: string;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  setRecentStory: (recentStory: string) => void;
  setRecentStoryTitle: (recentStory: string) => void;
  setLoading: (loading: boolean) => void;
  setStoryImage: (image: string) => void;
  clearSettings: () => void;
}

const defaultSettingsData: SettingsData = {
  name: '',
  language: 'locale',
  languageLabel: 'English (United States)',
  age: 1,
  length: 1,
  motivation: '',
  storyComponents: '',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settingsData: defaultSettingsData,
      recentStory: '',
      recentStoryTitle: '',
      loading: false,
      storyImage: '',
      updateSettings: (newSettings) =>
        set((state) => ({
          settingsData: { ...state.settingsData, ...newSettings },
        })),
      setRecentStory: (recentStory) => set({ recentStory }),
      setRecentStoryTitle: (recentStoryTitle) => set({ recentStoryTitle }),
      setLoading: (loading) => set({ loading }),
      setStoryImage: (image) => set({ storyImage: image }),
      clearSettings: () =>
        set({
          settingsData: defaultSettingsData,
          recentStory: '',
          storyImage: '',
        }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
