import React, {useState, useEffect, useRef} from 'react';
import {Animated, View, } from 'react-native';
import {useSseEventSource} from '../api/SseEventSource';

export const MidjourneyImg = ({prompt}) => {
  const [storyImg, setStoryImg] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const fadeOutPreviousImage = useRef(new Animated.Value(1)).current;
  const fadeInCurrentImage = useRef(new Animated.Value(0)).current;

  
    // call Midjourney API
  useEffect(() => {
    const cleanup = useSseEventSource(setStoryImg, prompt);
    return cleanup;
  }, []);

  // Update images
  useEffect(() => {
    if (storyImg !== currentImage) {
      setPreviousImage(currentImage);
      setCurrentImage(storyImg);
      // Reset the animation values
      fadeOutPreviousImage.setValue(1);
      fadeInCurrentImage.setValue(0);
    }
  }, [storyImg]);

  //Animate images
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOutPreviousImage, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInCurrentImage, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentImage]);

  return (
    <>
      <View className="    ">
        <Animated.View>
          {currentImage && (
            <Animated.Image
              source={{uri: currentImage}}
              style={{
                opacity: fadeInCurrentImage,
                position: 'absolute',
                width: 200,
                height: 200,
              }}
            />
          )}

          {previousImage && (
            <Animated.Image
              source={{uri: previousImage}}
              style={{
                opacity: fadeOutPreviousImage,
                position: 'absolute',
                width: 200,
                height: 200,
              }}
            />
          )}
        </Animated.View>
      </View>
    </>
  );
};
