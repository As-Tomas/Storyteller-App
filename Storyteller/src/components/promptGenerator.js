

import * as RNLocalize from "react-native-localize";
//age: 5, language: "locale", length: 3, motivation: "To do homework ", name: "", storyComponents: "SpideruserReq"

export function generatePrompt(userReq, userSettings) {
    const age = userSettings.age || 5;
    const language = userSettings.language || 'locale';
    const length = userSettings.length * 100;
    const motivation = userSettings.motivation || '';
    const name = userSettings.name || '';
    const storyComponents = userSettings.storyComponents || '';

    // { countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false },
    // RNLocalize.getLocales()[0].languageCode
    // RNLocalize.getLocales()[0].languageTag    

    return `Please write me a fairy tale for ${age} years old kid, in ${length} words or less, response language ${language === 'locale' ? RNLocalize.getLocales()[0].languageTag : language}, ${motivation ? "motivation should be: "+ motivation + ", " : ""} 
    fairy tale should be about ${userReq}${name ? ", and the main character should be " + name +", ": "."} ${storyComponents ? "The story should include " + storyComponents + ".": ""}`;
  };