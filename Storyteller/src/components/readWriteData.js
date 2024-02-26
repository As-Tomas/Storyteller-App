import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsData = {
  name: '',
  language: 'locale',
  age: 1,
  length: 1,
  motivation: '',
  storyComponents: '',
};

export async function readData(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const userSettings = JSON.parse(jsonValue);

    if (userSettings && Object.keys(userSettings).length > 0) {
      console.log('second', userSettings);
      return userSettings;
    } else {
      // Default values
      await AsyncStorage.setItem(key, JSON.stringify(settingsData));
      return settingsData;
    }
  } catch (e) {
    console.log('reading Error');
    console.log(e);
  }
}

export async function writeData(key, userSettings) {
  try {
    const jsonValue = JSON.stringify(userSettings);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('writing Error');
    console.log(e);
  }
}
