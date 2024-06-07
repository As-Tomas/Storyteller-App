import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatgptUrl = 'https://api.openai.com/v1/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const chatgptApiCall = async (prompt: string) => {
  console.log('🚀 ~ chatgptApiCall ~ INCOMING prompt: ', prompt);
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      max_tokens: 550,
      temperature: 0.7,
    });

    let answer = res.data?.choices[0]?.text;

    let tokensUsed = res.data?.usage?.total_tokens;
    console.log('Tokens used:', tokensUsed);

    console.log('got chat response: ', answer);

    return Promise.resolve({ success: true, data: answer });
  } catch (err) {
    console.log('error: ', err);
    console.log('Error Response:', err.response.data);
    return Promise.resolve({ success: false, msg: err.message });
  }
};

export const getImagePrompt = async (prompt: string) => {
  console.log('🚀 ~ getImagePrompt ~ getImagePrompt:');
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      max_tokens: 550,
      temperature: 0.7,
    });

    let answer = res.data?.choices[0]?.text;

    let tokensUsed = res.data?.usage?.total_tokens;
    console.log('Tokens used:', tokensUsed);

    console.log('got chat response for image prompt: ', answer);

    return Promise.resolve({ success: true, data: answer });
  } catch (err) {
    console.log('error: ', err);
    console.log('Error Response:', err.response.data);
    return Promise.resolve({ success: false, msg: err.message });
  }
};

//----------------------------------------------------------------------
