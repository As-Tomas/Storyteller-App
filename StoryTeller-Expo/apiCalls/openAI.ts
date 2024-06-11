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
  let answer=`Once upon a time, in a land not too far from here, there was a magical forest called Whispering Woods. This forest was unlike any other, filled with ancient trees that seemed to touch the sky, vibrant flowers that glowed in the dark, and streams that sang melodious tunes as they flowed.

  In the heart of Whispering Woods lived a curious young elf named Elara. Elara had sparkling green eyes and a heart full of wonder. She was known for her adventurous spirit and her ability to communicate with all the creatures of the forest. Her best friend was a wise old owl named Ollie, who had seen many things in his long life.
  
  One sunny morning, as the first rays of the sun kissed the leaves, Elara set off on a new adventure. She had heard rumors of a hidden glade deep within the forest, where a mystical flower called the Starblossom bloomed only once every hundred years. It was said that the Starblossom had the power to grant any wish to the one who found it.
  
  Elara and Ollie journeyed through the dense woods, following a trail of twinkling fireflies. Along the way, they met many of their forest friends – the playful squirrels, the gentle deer, and even the shy unicorn named Luna. Each friend offered a clue or a bit of help, guiding them closer to the hidden glade.
  
  As they ventured deeper, the forest grew darker and the path more winding. But Elara was not afraid. She knew that with courage and kindness, they could find their way. Finally, after what seemed like hours, they arrived at a clearing bathed in a soft, ethereal light. In the center of the clearing stood the Starblossom, its petals shimmering like diamonds.
  
  Elara approached the flower with awe. She closed her eyes and made a wish from the depths of her heart – a wish for the forest to remain safe and magical for all its inhabitants. As she whispered her wish, the Starblossom glowed brightly, and a gentle breeze carried her words through the forest.
  
  Suddenly, the clearing was filled with a warm, golden light. The trees swayed in joy, the flowers danced, and the streams sang even more beautifully. Elara's wish had been granted. Whispering Woods would remain a haven of magic and wonder forever.
  
  With a heart full of happiness, Elara and Ollie made their way back home, knowing that their beloved forest would always be protected. And so, the magic of Whispering Woods continued to thrive, inspiring generations of adventurers to come.
  
  The end.`;
  return Promise.resolve({ success: true, data: answer });
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
  let answer= "this is super duper image prompt"
  return Promise.resolve({ success: true, data: answer });
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
  const link ="https://images.unsplash.com/photo-1618085249444-1b2342b7917b?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  return { success: true, image: link };
  console.log("🚀 ~ dalleApiCall ~ prompt:", prompt)

  let image;
  try {
    if (prompt === "") {
      throw new Error("Prompt for image is required");
    }

    if (prompt.length > 1000) {
      // The maximum length is 1000 characters for dall-e-2 and 4000 characters for dall-e-3
      prompt = prompt.substring(0, 1000);
    }

    // https://openai.com/api/pricing/
    // https://platform.openai.com/docs/api-reference/images/create
    image = await client.post(dalleUrl, {
      model: 'dall-e-2',  //dall-e-2 or dall-e-3
      prompt: prompt,  
      response_format: "b64_json",
      size: "256x256",  //1024x1024 or 1024x1792 or 512x512 256x256
      // quality: "hd",
      // style: "vivid",  //dall-e-2 doesn't support style
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

            return { success: true, image: `data:image/png;base64,${image.data.data[0].b64_json}` };
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
  
