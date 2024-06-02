import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultSettingsData = {
  name: "",
  language: "locale",
  languageLabel: "English (United States)",
  age: 1,
  length: 1,
  motivation: "",
  storyComponents: "",
};

// todo: when finis with saving history remove this and AsyncStorage
export async function readData(key: string) { 
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const userSettings = JSON.parse(jsonValue || "{}");

    if (userSettings && Object.keys(userSettings).length > 0) {
      return userSettings;
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(defaultSettingsData));
      return defaultSettingsData;
    }
  } catch (e) {
    console.log("reading Error");
    console.log(e);
    return defaultSettingsData; // Return default on error
  }
}

export async function writeData(key: string, value: any) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log("writing Error");
    console.log(e);
  }
}
