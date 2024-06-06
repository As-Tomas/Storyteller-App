// import { create } from "zustand";
// import { zustandStorage } from "./mmkv-storage";
// import { createJSONStorage, persist } from "zustand/middleware";

// interface SettingsData {
//   name: string;
//   language: string;
//   languageLabel: string;
//   age: number;
//   length: number;
//   motivation: string;
//   storyComponents: string;
// }
// interface HistoryItem {
//   story: string;
//   image: string;
//   title: string;
//   dateSaved: Date;
// }
// interface SettingsState {
//   settingsData: SettingsData;
//   recentStory: string;
//   storyImage: string;
//   history: HistoryItem[];
//   updateSettings: (newSettings: Partial<SettingsData>) => void;
//   setRecentStory: (recentStory: string, title: string) => void;
//   setStoryImage: (image: string) => void;
//   clearSettings: () => void;
// }

// const defaultSettingsData: SettingsData = {
//   name: "",
//   language: "locale",
//   languageLabel: "English (United States)",
//   age: 1,
//   length: 1,
//   motivation: "",
//   storyComponents: "",
// };

// export const useSettingsStore = create<SettingsState>()(
//   persist(
//     (set) => ({
//       settingsData: defaultSettingsData,
//       recentStory: "",
//       storyImage: "",
//       history: [],
//       updateSettings: (newSettings) =>
//         set((state) => ({
//           settingsData: { ...state.settingsData, ...newSettings },
//         })),
//       setRecentStory: (recentStory, title) =>
//         set((state) => {
//           const newHistoryItem: HistoryItem = {
//             story: state.recentStory,
//             image: state.storyImage,
//             title: title,
//             dateSaved: new Date(),
//           };
//           return {
//             recentStory,
//             history: [...state.history, newHistoryItem],
//           };
//         }),
//       setStoryImage: (image) => set({ storyImage: image }),
//       clearSettings: () =>
//         set({
//           settingsData: defaultSettingsData,
//           recentStory: "",
//           storyImage: "",
//         }),
//     }),
//     {
//       name: "settings-store",
//       storage: createJSONStorage(() => zustandStorage),
//     }
//   )
// );

// interface HistoryStore {
//   history: HistoryItem[];
// }


// export const useHistoryStore = create<HistoryStore>(

// );

import { create } from "zustand";
import { zustandStorage } from "./mmkv-storage";
import { createJSONStorage, persist } from "zustand/middleware";

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
  storyImage: string;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  setRecentStory: (recentStory: string) => void;
  setStoryImage: (image: string) => void;
  clearSettings: () => void;
}

const defaultSettingsData: SettingsData = {
  name: "",
  language: "locale",
  languageLabel: "English (United States)",
  age: 1,
  length: 1,
  motivation: "",
  storyComponents: "",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settingsData: defaultSettingsData,
      recentStory: "",
      storyImage: "",
      updateSettings: (newSettings) =>
        set((state) => ({
          settingsData: { ...state.settingsData, ...newSettings },
        })),
      setRecentStory: (recentStory) =>
        set({ recentStory }),
      setStoryImage: (image) => set({ storyImage: image }),
      clearSettings: () =>
        set({
          settingsData: defaultSettingsData,
          recentStory: "",
          storyImage: "",
        }),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
