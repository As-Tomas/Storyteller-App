import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// import { useNavigation } from "@react-navigation/native";
// import Image from 'expo-fast-image';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { getImagePrompt, chatgptApiCall, dalleApiCall } from '../apiCalls/openAI';
import { MidjourneyImg } from '../components/imgEfects';
import UserTextInput from '../components/UserTextInput';
import { Link, router,  } from 'expo-router';
import { useSettingsStore } from '../utils/Store/settingsStore';
import { Image } from 'expo-image';
import { useHistoryStore } from '../utils/Store/historyStore';
import { adjustImagePrompt, generatePrompt } from '@/components/promptGenerator';
import { useFocusEffect, useLocalSearchParams  } from 'expo-router';
import { useCallback } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import ImageStoryView from '@/components/ImageStoryView';
import PlaybackControls from '@/components/navigation/PlaybackControls';

export default function CildScreen() {    
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [storyImage, setStoryImage] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storySaved, setStorySaved] = useState('');

  const { addHistoryItem } = useHistoryStore();

  const { settingsData, recentStory, setRecentStory } = useSettingsStore((state) => ({
    settingsData: state.settingsData,
    recentStory: state.recentStory,
    setRecentStory: state.setRecentStory,
  }));

  // safe to history
  useEffect(() => {
    if (recentStory !== '' && storySaved !== recentStory && storyImage !== '' && storyTitle !== '') {
      addHistoryItem(recentStory, storyImage, storyTitle);
      setStorySaved(recentStory);
    }
  }, [ storyImage,]);

  // show mic at the end
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;    
    const threshold = 35;  
    
    if (offsetY + scrollViewHeight + threshold >= contentHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const speechStartHandler = (e: any) => {
    console.log('speech start event', e);
  };
  const speechEndHandler = (e: any) => {
    setRecording(false);
    stopRecording();
    console.log('speech stop event', e);
  };
  const speechResultsHandler = (e: any) => {
    console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };
  const speechErrorHandler = (e: any) => {
    console.log('speech error: ', e);
    if (e.error.message === '7/No match') {
      let erMsg = 'No words matched, try to say louder and more than one word.';
      Alert.alert('Error', erMsg);
    }
    if (e.error.message === '5/Client side error') {
      //Todo Find out what this er means
      let erMsg = 'Find out what this er means: 5/Client side error.';
      Alert.alert('Error', erMsg);
    } else {
      Alert.alert('Error', e.error.message);
    }
  };

  const startRecording = async () => {
    setRecording(true);
    console.log('first');
    Tts.stop();
    try {
      //! set language from userSettings.language to use devices local language
      await Voice.start(settingsData.language); // en-GB | settingsData.language and todo: display languageLabel is sotored in user settings
    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchResponse = (userInput: string) => {
    if (userInput.trim().length > 0) {
      setLoading(true);
      let newUserRequest = userInput.trim();
      let prompt = generatePrompt(newUserRequest, settingsData);

      chatgptApiCall(prompt).then((res) => {
        setLoading(false);
        if (res.success) {
          setRecentStory(res.data);
          startTextToSpeach(res.data);
          setIsVisible(false);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const preparePromptForImage = (recentStory: string) => {
    return `Be the prompt an engineer, sumarize this story and create single promt, respond just with prompt text . Here is the story: " ${recentStory} "`;
  };

  const startTextToSpeach = (recentStory: string) => {
    setSpeaking(true);
    Tts.speak(recentStory, {
      iosVoiceId: '',
      rate: 0.5,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  //Todo: plus add pause funcionality
  const beginSpeaking = () => {
    startTextToSpeach(recentStory);
  };

  const pauseSpeaking = () => {
    Tts.pause(); //Todo: not implemented jet
    setSpeaking(false);
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  //this one for STT
  useEffect(() => {
    if (result) {
      setStoryTitle(result);
      fetchResponse(result);
    }
  }, [result]);

  useEffect(() => {
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // tts handlers
    // Tts.addEventListener('tts-start', (event) => console.log('start', event));
    // Tts.addEventListener('tts-progress', event =>
    //   console.log('progress', event),
    // );
    Tts.addEventListener('tts-finish', (event) => {
      console.log('finish', event);
      setSpeaking(false);
    });
    // Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event));

    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);  

  // generate Promt for the next image and after generate image
  const fetchPromptForImage = () => {
    if (recentStory !== '') {
      let prompt = preparePromptForImage(recentStory);

      getImagePrompt(prompt).then(res => {
        //setLoading(false);
        if (res.success) {

          const adjustedPrompt = adjustImagePrompt(res.data);

          dalleApiCall(adjustedPrompt).then(res => {
            if (res.success) {
              setStoryImage(res.image);
            } else {
              Alert.alert('Error', res.msg);
            }
          }).catch(err => {
            console.log("Error during DALL-E API call:", err.message);
          });

        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  useEffect(() => {
    if (recentStory) {
      fetchPromptForImage();
    }
  }, [recentStory]);

  // Stop TTS when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        Tts.stop();
      };
    }, []),
  );

  // Split the story into paragraphs
  const paragraphs = recentStory.split('\n');

  // Find the middle paragraph
  const midPoint = Math.floor(paragraphs.length / 2);

  // Join the paragraphs back together
  const firstHalf = paragraphs.slice(0, midPoint).join('\n');
  const secondHalf = paragraphs.slice(midPoint).join('\n');

  const resetScreenState = () => {
    setStoryTitle('');
    setStoryImage('');
    setRecentStory('');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/ChildScrBackground.png')}
      className="flex-1 "
      imageStyle={recentStory === '' ? { opacity: 1 } : { opacity: 0.7 }}
      style={{ backgroundColor: 'black' }}>
      <View className="flex-1  items-center justify-center relative">
        <TouchableOpacity
          onPress={() => {
            // Tts.stop(); // Stop the voice before navigation
            router.push('/');
          }}
          className="absolute z-10 top-6 left-4 flex-row items-center justify-center px-2 rounded-3xl "
          style={{ backgroundColor: 'rgba(107, 114, 128, 0.7)' }}>
          <Image source={require('@/assets/elements/arrow_back.png')} style={{ width: hp(2), height: hp(2) }} />
          <Text className="text-yellow-100 m-2 " style={{ fontSize: wp(3.5) }}>
            Start
          </Text>
        </TouchableOpacity>

        {recentStory === '' ? (
          <Text className="text-yellow-100 mx-10 text-center" style={{ fontSize: wp(9) }}>
            Tell what story you would like to hear?
          </Text>
        ) : (
          <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
            <Text 
            className="text-yellow-100 mx-auto pt-10 text-center " style={{ fontSize: wp(7)}}
            numberOfLines={2} 
            >
              {storyTitle}
            </Text>  
             


            <Text
              className="text-yellow-100 mx-2 pb-8 text-justify"
              style={{
                fontSize: wp(4.5),
                textShadowColor: 'black',
                textShadowRadius: 5,
              }}>
              {firstHalf}
            </Text>
            
            {storyImage ? (
              <ImageStoryView image={storyImage} />
              //Todo: add some drawing animation
            ) : null} 


            <Text
              className="text-yellow-100 mx-2 pb-40 pt-8 text-justify "
              style={{
                fontSize: wp(4.5),
                textShadowColor: 'black',
                textShadowRadius: 5,
              }}>
              {secondHalf}
            </Text>

            <View></View>
          </ScrollView>
        )}

        {isVisible && (
          <View className="absolute bottom-12">
            {loading ? (
              <Image
                className="rounded-full"
                source={require('@/assets/elements/loading.gif')}
                style={{ width: hp(10), height: hp(10) }}
              />
            ) : recording ? (
              <TouchableOpacity onPress={stopRecording}>
                <Image
                  className="rounded-full"
                  source={require('@/assets/elements/micRecording.gif')}
                  style={{ width: hp(10), height: hp(10) }}
                />
              </TouchableOpacity>
            ) : (
              <View className=" flex-col align-middle items-center ">
                <TouchableOpacity onPress={startRecording}>
                  <Image
                    className="rounded-full"
                    source={require('@/assets/elements/micIcon2.png')}
                    style={{ width: hp(10), height: hp(10) }}
                  />
                </TouchableOpacity>
                <UserTextInput setStoryTitle={setStoryTitle} setup={'child'} fetchResponse={fetchResponse} resetScreenState={resetScreenState} />
              </View>
            )}
          </View>
        )}

        <PlaybackControls
          speaking={speaking}
          recentStory={recentStory}
          stopSpeaking={stopSpeaking}
          pauseSpeaking={pauseSpeaking}
          beginSpeaking={beginSpeaking}
        />
      </View>
    </ImageBackground>
  );
}
