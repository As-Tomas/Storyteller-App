// context/UserSettingsContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { readData, writeData } from "../utils/storage";

interface UserSettings {
  name: string;
  language: string;
  languageLabel: string;
  age: number;
  length: number;
  motivation: string;
  storyComponents: string;
}

interface UserSettingsContextProps {
  settings: UserSettings | null;
  saveSettings: (newSettings: UserSettings) => void;
}

const defaultValue: UserSettingsContextProps = {
  settings: null,
  saveSettings: () => {},
};

export const UserSettingsContext =
  createContext<UserSettingsContextProps>(defaultValue);

interface UserSettingsProviderProps {
  children: ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const SETTINGS_KEY = "user_settings";

  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await readData(SETTINGS_KEY);
      setSettings(loadedSettings);
    };
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: UserSettings) => {
    await writeData(SETTINGS_KEY, newSettings);
    setSettings(newSettings);
  };

  return (
    <UserSettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};
