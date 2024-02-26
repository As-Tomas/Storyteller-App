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
    const data = JSON.parse(jsonValue);

    if (data && Object.keys(data).length > 0) {
      console.log('second', data);
      return data;
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

export async function writeData(key, data) {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('writing Error');
    console.log(e);
  }
}
