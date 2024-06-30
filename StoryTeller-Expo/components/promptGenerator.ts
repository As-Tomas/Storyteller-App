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
  const length = Math.pow(userSettings.length || 1, 2) * 100;
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

export function adjustImagePrompt(prompt: string): string {

  prompt = prompt.replace(/Prompt:|Prompt|prompt:|prompt/g, '');
  
  const addAdjustments = "The image should be purely visual, Do not include any text or words or inscriptions in the image!";

  return ` ${addAdjustments} Here is Image description: ${prompt.trim()} The image should be purely visual, Do not include any text or words or inscriptions in the image!`;
}
