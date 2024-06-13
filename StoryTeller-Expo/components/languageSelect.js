// import * as RNLocalize from 'react-native-localize'; // GPT recomended library for localization, maybe later we can use it for the app

// const languageOptions = [
//   {label: 'Device Locale (Automatic)', value: 'locale'}, // Default option
//   {label: 'English (United States)', value: 'en-US'},
//   {label: 'English (Canada)', value: 'en-CA'},
//   {label: 'English (Australia)', value: 'en-AU'},
//   {label: 'English (India)', value: 'en-IN'},
//   {label: 'English (New Zealand)', value: 'en-NZ'},
//   {label: 'English (Singapore)', value: 'en-SG'},
//   {label: 'English (Ireland)', value: 'en-IE'},
//   {label: 'English (South Africa)', value: 'en-ZA'},
//   {label: 'Spanish (Spain)', value: 'es-ES'},
//   {label: 'Spanish (Mexico)', value: 'es-MX'},
//   {label: 'Spanish (United States)', value: 'es-US'},
//   {label: 'Spanish (Argentina)', value: 'es-AR'},
//   {label: 'Spanish (Chile)', value: 'es-CL'},
//   {label: 'Spanish (Colombia)', value: 'es-CO'},
//   {label: 'Spanish (Peru)', value: 'es-PE'},
//   {label: 'Spanish (Venezuela)', value: 'es-VE'},
//   {label: 'French (France)', value: 'fr-FR'},
//   {label: 'French (Canada)', value: 'fr-CA'},
//   {label: 'French (Belgium)', value: 'fr-BE'},
//   {label: 'French (Switzerland)', value: 'fr-CH'},
//   {label: 'German (Germany)', value: 'de-DE'},
//   {label: 'German (Austria)', value: 'de-AT'},
//   {label: 'German (Switzerland)', value: 'de-CH'},
//   {label: 'Chinese (Mandarin China)', value: 'zh-CN'},
//   {label: 'Chinese (Mandarin Taiwan)', value: 'zh-TW'},
//   {label: 'Chinese (Cantonese)', value: 'zh-HK'},
//   {label: 'Italian (Italy)', value: 'it-IT'},
//   {label: 'Dutch (Netherlands)', value: 'nl-NL'},
//   {label: 'Russian (Russia)', value: 'ru-RU'},
//   {label: 'Japanese (Japan)', value: 'ja-JP'},
//   {label: 'Korean (Korea)', value: 'ko-KR'},
//   {label: 'Portuguese (Portugal)', value: 'pt-PT'},
//   {label: 'Portuguese (Brazil)', value: 'pt-BR'},
//   {label: 'Arabic (Saudi Arabia)', value: 'ar-SA'},
//   {label: 'Arabic (United Arab Emirates)', value: 'ar-AE'},
//   {label: 'Hindi (India)', value: 'hi-IN'},
//   {label: 'Thai (Thailand)', value: 'th-TH'},
//   {label: 'Turkish (Turkey)', value: 'tr-TR'},
//   {label: 'Swedish (Sweden)', value: 'sv-SE'},
//   {label: 'Danish (Denmark)', value: 'da-DK'},
//   {label: 'Norwegian (Norway)', value: 'no-NO'},
//   {label: 'Finnish (Finland)', value: 'fi-FI'},
//   {label: 'Polish (Poland)', value: 'pl-PL'},
//   {label: 'Hungarian (Hungary)', value: 'hu-HU'},
//   {label: 'Czech (Czech Republic)', value: 'cs-CZ'},
//   {label: 'Slovak (Slovakia)', value: 'sk-SK'},
//   {label: 'Greek (Greece)', value: 'el-GR'},
//   {label: 'Romanian (Romania)', value: 'ro-RO'},
//   {label: 'Bulgarian (Bulgaria)', value: 'bg-BG'},
//   {label: 'Ukrainian (Ukraine)', value: 'uk-UA'},
// ];

import * as RNLocalize from 'react-native-localize';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//this way user can choose from list of laguages he added in his device
//alternatively we can create native module but then may not work if use tts
const getSupportedLanguages = () => {
  const locales = RNLocalize.getLocales();

  return locales.map((locale) => ({
    label: `${locale.languageCode} (${locale.countryCode})`,
    value: `${locale.languageTag}`,
  }));
};

const languageOptions = getSupportedLanguages();

//todo implement the following function
// Function to get the system's current locale and set it as the default language option
const getCurrentLocale = () => {
  //   const locales = RNLocalize.getLocales();
  //   if (locales.length > 0) {
  //     return locales[0].languageTag; // Returns the current device locale
  //   }
  return 'locale'; // Fallback to 'locale' if unable to determine
};

// Example of how to set the default value for your dropdown
const defaultLanguageValue = getCurrentLocale();

const LanguageSelector = ({ language, setLanguage, setLanguageLabel }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const onLanguageChange = (itemValue) => {
    setSelectedLanguage(itemValue);
    setLanguage(itemValue);
    const selectedItem = languageOptions.find((option) => option.value === itemValue);
    const itemLabel = selectedItem ? selectedItem.label : '';
    setLanguageLabel(itemLabel);
  };

  return (
    <View style={styles.container}>
      <Picker selectedValue={selectedLanguage} onValueChange={onLanguageChange} style={styles.picker}>
        {languageOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '(rgba(255, 255, 255, 0.3)',
    
  },  
});

export default LanguageSelector;
