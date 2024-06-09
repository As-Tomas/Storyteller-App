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

//! Error Response: {"error": {"code": "insufficient_quota", "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.", "param": null, "type": "insufficient_quota"}}
 
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

    // let answer =
    //   'Please write me a fairy tale for a 1 years old kid, in 100 words or less, response language en-US, fairy tale should be about apples and potato.';
    // let answer = "Please ";
    console.log('got chat response: ', answer);

    return Promise.resolve({ success: true, data: answer });
  } catch (err) {
    console.log('error: ', err);
    // console.log('Error Response:', err.response.data);
    return Promise.resolve({ success: false, msg: err.message });
  }
};

export const getImagePrompt = async (prompt: string) => {
  console.log("🚀 ~ getImagePrompt ~ prompt:", prompt)
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

export const dalleApiCall = async (prompt: string) => {
console.log("🚀 ~ dalleApiCall ~ prompt:", prompt)

  let image;
  try {
    if (prompt === "") {
      throw new Error("Prompt for image is required");
    }

    image = await client.post(dalleUrl, {
      model: 'dall-e-3',
      prompt: prompt,
      response_format: "b64_json",
      size: "1024x1792",
      quality: "hd",
      style: "vivid",
    });

    // // Log the entire response for debugging
    // console.log("Full API Response:", image);

    if (image.data) {
      // console.log("Response data if", );
      if (Array.isArray(image.data.data)) {
        // console.log("Data array length:", image.data.data.length);
        if (image.data.data.length > 0) {
          // console.log("First item in data array:", image.data.data[0]);
          if (image.data.data[0].b64_json) {
            // console.log("url present:", image.data.data[0].b64_json);
            return { success: true, image: image.data.data[0].b64_json };
          } else {
            // console.log("b64_json missing in first item of data array");
            throw new Error("b64_json missing in first item of data array");
          }
        } else {
          // console.log("Data array is empty");
          throw new Error("Data array is empty");
        }
      } else {
        // console.log("Data is not an array");
        throw new Error("Data is not an array");
      }
    } else {
      // console.log("Data is missing in response");
      throw new Error("Data is missing in response");
    }
   
  } catch (err) {
    console.log("error in api call: ", err.message);
    return { success: false, msg: err.message };
  }
};
  
