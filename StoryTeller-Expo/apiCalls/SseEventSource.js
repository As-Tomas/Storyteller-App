import React, { useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { midjourneyApiImagine } from './MidjouyrneyApi';

export function useSseEventSource(setStoryImg, prompt) {
  console.log('useEffect STARTED');

  //Todo: add user registration screen and set here userName
  //Todo: set user name in body not header
  const userName = 'testUser';
  const eventSource = new EventSourcePolyfill('http://10.0.2.2:3000/api/events', {
    headers: {
      'X-API-Key': process.env.EXPO_PUBLIC_SALAI_TOKEN,
      userName: userName,
    },
  });

  console.log('EventSource readyState:', eventSource.readyState);

  // Handle a connection opening
  eventSource.onopen = function (event) {
    console.log('Connection to server opened.');
  };

  eventSource.onmessage = (event) => {
    console.log('New message:', event.data);
    console.log('EventSource readyState:', eventSource.readyState);
    const data = JSON.parse(event.data);
    const status = data['status'];
    console.log('status', status);
    if (status === 'in-progress') {
      const uri = data['uri'];
      const progress = data['progress'];
      setStoryImg(uri);
    } else if (status === 'completed') {
      const img = data['img'];
      setStoryImg(img);
      eventSource.close();
    }
  };

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
  };

  //Call the API to generate the image
  midjourneyApiImagine(prompt, userName);

  return () => {
    console.log('eventSource.close() excecuted');
    eventSource.close();
  };
}
