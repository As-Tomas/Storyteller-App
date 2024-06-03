import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// import { useNavigation } from "@react-navigation/native";
import FastImage from 'expo-fast-image';
import Voice from "@react-native-voice/voice";
import Tts from "react-native-tts";
import { getImagePrompt, chatgptApiCall } from "../apiCalls/openAI";
import { MidjourneyImg } from "../components/imgEfects";
import UserTextInput from "../components/TextInput";
import { Link, router } from 'expo-router';
import { useSettingsStore } from '@/utils/Store/settingsStore';

//! I think child screen should use story screen to display the story

export default function CildScreen() {
    // const navigation = useNavigation();
    const [recording, setRecording] = useState(false);
    const [result, setResult] = useState('');
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [speaking, setSpeaking] = useState(false);
    const [imagePrompt, setImagePrompt] = useState('');
    const [userInputText, setUserInputText] = useState('');    
    
    const { settingsData } = useSettingsStore((state) => ({ // ! Todo I think if parent set up some settings it should load them by default
        settingsData: state.settingsData,        
      }));

    const handleScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
  
      // Check if user has reached the end of the ScrollView
      if (offsetY + scrollViewHeight >= contentHeight) {
        // Hide the view
        setIsVisible(true);
      } else {
        // Show the view
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
        console.log('first', )
      Tts.stop();
      try {
        //! set language from userSettings.language to use devices local language
        await Voice.start("en-GB"); // en-GB | userSettings.language 
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
  
    const generatePrompt = (userReq: string) => {
      return `Please tell me a fairy tale about ${userReq}`;
    };
  
    const preparePromptForImage = (story: string) => {
      return `Be the prompt an engineer, sumarize this story and create single promt, respond just with prompt text . Here is the story: " ${story} "`;
    };
  
    const fetchResponse = (userInput: string) => {
      if (userInput.trim().length > 0) {
        setLoading(true);
        let newUserRequest = userInput.trim();
        let prompt = generatePrompt(newUserRequest);
  
        //! temp disabling
        setStory("Once upon a time in a magical kingdom, there lived a young princess named Melody.");
        
        // chatgptApiCall(prompt).then(res => {            
        //   setLoading(false);
        //   if (res.success) {
        //     setStory(res.data);
        //     startTextToSpeach(res.data);
        //   } else {
        //     Alert.alert('Error', res.msg);
        //   }
        // });
      }
    };

    // for note beafore migration to expo
    // const startTextToSpeach = (story: string) => {
    //     setSpeaking(true);
    //     Tts.speak(story, {
    //       androidParams: {
    //         KEY_PARAM_PAN: -1,
    //         KEY_PARAM_VOLUME: 0.5,
    //         KEY_PARAM_STREAM: 'STREAM_MUSIC',
    //       },
    //     });
    //   };
    
  
    const startTextToSpeach = (story: string) => {
        setSpeaking(true);
        Tts.speak(story, {
            iosVoiceId: '',
            rate: 0.5,
            androidParams: {
                KEY_PARAM_PAN: -1,
                KEY_PARAM_VOLUME: 0.5,
                KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
        });
    };

    const stopSpeaking = () => {
        Tts.stop();
        setSpeaking(false);
    };
  
    useEffect(() => {
      if (result) {
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
      Tts.addEventListener('tts-start', event => console.log('start', event));
      // Tts.addEventListener('tts-progress', event =>
      //   console.log('progress', event),
      // );
      Tts.addEventListener('tts-finish', event => {
        console.log('finish', event);
        setSpeaking(false);
      });
      Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
  
      return () => {
        // destroy the voice instance after component unmounts
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
  
    // generate Promt for the next image
    const fetchPromptForImage = () => {
      if (story !== '') {
        let prompt = preparePromptForImage(story);
  
        getImagePrompt(prompt).then(res => {

            //! temp disabling

            console.log('getImagePrompt request disabled')

        //   //setLoading(false);
        //   if (res.success) {
        //     console.log('res.data', res.data);
        //     setImagePrompt(`${res.data}  --ar 9:16`);
        //   } else {
        //     Alert.alert('Error', res.msg);
        //   }
        });
      }
    };
  
    useEffect(() => {
      if (story) {
        fetchPromptForImage();
      }
    }, [story]);
  
    // Split the story into paragraphs
    const paragraphs = story.split('\n');
  
    // Find the middle paragraph
    const midPoint = Math.floor(paragraphs.length / 2);
  
    // Join the paragraphs back together
    const firstHalf = paragraphs.slice(0, midPoint).join('\n');
    const secondHalf = paragraphs.slice(midPoint).join('\n');
    //-------------------------------
  
    useEffect(() => {
      if (userInputText) {
        fetchResponse(userInputText);
      }
    }, 
    [userInputText]);

    
    const homeRoute = ()=>{
      return router.push('/');
    }
    
    return (
      <ImageBackground
        source={require('@/assets/images/ChildScrBackground.png')}
        className="flex-1 "
        imageStyle={story === '' ? {opacity: 1} : {opacity: 0.7}}
        style={{backgroundColor: 'black'}}>
        <View className="flex-1  items-center justify-center relative">
          <TouchableOpacity
            onPress={() => {
              Tts.stop(); // Stop the voice before navigation
              homeRoute(); // Navigate to the home screen
            }}
            className="absolute z-10 top-6 left-4 flex-row items-center justify-center bg-gray-500 rounded-3xl ">
            <Image
              source={require('@/assets/elements/arrow_back.png')}
              style={{width: hp(2), height: hp(2)}}
            />
            <Text className="text-yellow-100 m-2" style={{fontSize: wp(3.5)}}>
              Start
            </Text>
          </TouchableOpacity>
  
          {story === '' ? (
            <Text
              className="text-yellow-100 mx-10 text-center"
              style={{fontSize: wp(9)}}>
              Tell what story you would like to hear?
            </Text>
          ) : (
            <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
              <Text
                className="text-yellow-100 mx-auto pt-10 text-center"
                style={{fontSize: wp(7)}}>
                Once upon a time
              </Text>
  
              <Text
                className="text-yellow-100 mx-2 pb-8 "
                style={{
                  fontSize: wp(4.5),
                  textShadowColor: 'black',
                  textShadowRadius: 5,
                }}>
                {firstHalf}
              </Text>
  
              {imagePrompt && (
                <View style={{alignItems: 'center'}}>
                  {/* <MidjourneyImg prompt={imagePrompt} /> //! temp disabling */}
                </View>
              )}
  
              <Text
                className="text-yellow-100 mx-2 pb-40 pt-8  "
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
            <View disabled={!isVisible} className="absolute bottom-12">
              {loading ? (
                <FastImage
                  className="rounded-full"
                  source={require('@/assets/elements/loading.gif')}
                  style={{width: hp(10), height: hp(10)}}
                />
              ) : recording ? (
                <TouchableOpacity onPress={stopRecording}>
                  <FastImage
                    className="rounded-full"
                    source={require('@/assets/elements/micRecording.gif')}
                    style={{width: hp(10), height: hp(10)}}
                  />
                </TouchableOpacity>
              ) : (
                <View className=" flex-col align-middle items-center ">
                <TouchableOpacity onPress={startRecording}>
                  <Image
                    className="rounded-full"
                    source={require('@/assets/elements/micIcon2.png')}
                    style={{width: hp(10), height: hp(10)}}
                  />
                </TouchableOpacity>              
                <UserTextInput setUserInputText={setUserInputText} setup={"child"}/>
                
                </View>
              )}
            </View>
          )}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl p-2 absolute bottom-16  left-10">
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    );
  }
  