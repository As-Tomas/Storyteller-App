import axios from 'axios';

export const midjourneyApiImagine = async (prompt, userName) => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/imagine', {
        method: 'POST', // or 'POST' if you are sending data
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.EXPO_PUBLIC_SALAI_TOKEN,
        },
        body: JSON.stringify({prompt, userName}), // Send the prompt if using POST
      });
  
      //     const responseText = await response.text(); // Get the raw response text
      // console.log('Raw response:', responseText);
  
      const jsonResponse = await response.json();
      console.log('API call response:', jsonResponse);
    } catch (error) {
      console.error('API call error:', error);
    }
  };