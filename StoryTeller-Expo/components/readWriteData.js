import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsData = {
  name: '',
  language: 'locale',
  languageLabel: 'English (United States)',
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


export async function writeData(key, value) {
  try {
    if (key === 'history') {
      // Read existing history the object should look like this: {creationDate, title, story, image}
      const jsonValue = await AsyncStorage.getItem(key);
      let history = JSON.parse(jsonValue);

      // Check if history is an array, if not, initialize it as an empty array
      if (!Array.isArray(history)) {
        console.log('Error: history data is not an array');
        history = [];
      }

      // Add creationDate to new record
      const newRecord = {
        ...value,
        creationDate: new Date().toLocaleDateString(),
      };

      // Add record to the beginning of history
      history.unshift(newRecord);

      // Write back to AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(history));
    } else {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (e) {
    console.log('writing Error');
    console.log(e);
  }
}
