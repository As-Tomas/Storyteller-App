import * as RNLocalize from 'react-native-localize';

type UserSettings = {
  age?: number;
  language?: string;
  length?: number;
  motivation?: string;
  name?: string;
  storyComponents?: string;
};

export function generatePrompt(userReq: string, userSettings: UserSettings): string {
  console.log('🚀 ~ generatePrompt ~ generatePrompt:-----------------------------------------------');
  const age = userSettings.age || 5;
  const language = userSettings.language || 'locale';
  const length = (userSettings.length || 3) * 100;
  const motivation = userSettings.motivation || '';
  const name = userSettings.name || '';
  const storyComponents = userSettings.storyComponents || '';

  return `Please write me a fairy tale for a ${age} years old kid, in ${length} words or less, response language ${
    language === 'locale' ? RNLocalize.getLocales()[0].languageTag : language
  }, ${motivation ? 'motivation should be: ' + motivation + ', ' : ''} 
  fairy tale should be about ${userReq}${name ? ', and the main character should be ' + name + ', ' : '.'} ${
    storyComponents ? 'The story should include ' + storyComponents + '.' : ''
  }`;
}
