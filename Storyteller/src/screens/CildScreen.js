import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Voice from '@react-native-community/voice';
import {apiCall, chatgptApiCall} from '../api/openAI';
import Tts from 'react-native-tts';

export default function CildScreen() {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const handleScroll = event => {
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

  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    stopRecording();
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };
  const speechErrorHandler = e => {
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
    Tts.stop();
    try {
      await Voice.start('en-GB'); // en-US
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

  const generatePrompt = userReq => {
    return `Please tell me a fairy tale about ${userReq}`;
  };

  const fetchResponse = userInput => {
    if (userInput.trim().length > 0) {
      setLoading(true);
      let newUserRequest = userInput.trim();
      let prompt = generatePrompt(newUserRequest);

      chatgptApiCall(prompt).then(res => {
        setLoading(false);
        if (res.success) {
          setStory(res.data);
          startTextToSpeach(res.data);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const startTextToSpeach = story => {
    setSpeaking(true);
    Tts.speak(story, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  }

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
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
    Tts.addEventListener('tts-finish', (event) => {
      console.log("finish", event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  //console.log('result: ', result);

  return (
    <ImageBackground
      source={require('../../assets/img/tomasb_b04_Illustrate_a_starry_night_sky_filled_with_constellat_a29cd721-0d0b-46f8-89f5-671376f1c65c.png')}
      className="flex-1 "
      imageStyle={story === '' ? {opacity: 1} : {opacity: 0.7}}
      style={{backgroundColor: 'black'}}>
      <View className="flex-1  items-center justify-center relative">
        <TouchableOpacity
          onPress={() => {
            Tts.stop(); // Stop the voice before navigation
            navigation.navigate('Welcome'); // Navigate to the 'Welcome' screen
          }}
          className="absolute z-10 top-6 left-4 flex-row items-center justify-center">
          <Image
            source={require('../../assets/elements/arrow_back.png')}
            style={{width: hp(2), height: hp(2)}}
          />
          <Text className="text-yellow-100" style={{fontSize: wp(3.5)}}>
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
              className="text-yellow-100 mx-2 pb-40 "
              style={{fontSize: wp(4.5), textShadowColor: 'black', textShadowRadius: 5}}>
              {story}
            </Text>
            <View></View>
          </ScrollView>
        )}

        {isVisible && (
          <View disabled={!isVisible} className="absolute bottom-12">
            {loading ? (
              <FastImage
                className="rounded-full"
                source={require('../../assets/elements/loading.gif')}
                style={{width: hp(10), height: hp(10)}}
              />
            ) : recording ? (
              <TouchableOpacity onPress={stopRecording}>
                <FastImage
                  className="rounded-full"
                  source={require('../../assets/elements/micRecording.gif')}
                  style={{width: hp(10), height: hp(10)}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startRecording}>
                <Image
                  className="rounded-full"
                  source={require('../../assets/elements/micIcon2.png')}
                  style={{width: hp(10), height: hp(10)}}
                />
              </TouchableOpacity>
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
