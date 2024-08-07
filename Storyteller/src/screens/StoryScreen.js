import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';

export default function StoryScreen({ route }) {
  const [storyResponse, setStoryResponse] = useState('oOo');
  const navigation = useNavigation();
  const { story } = route.params;
  useEffect(() => {
    if (story) {
      setStoryResponse(story);
      startTextToSpeach(story);
    }
  }, [story]);

  const startTextToSpeach = story => {
    // setSpeaking(true);
    Tts.speak(story, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  }; 
  
  return (
    <View className="flex-1 bg-fuchsia-800 items-center p-5 pt-8 relative">
      <TouchableOpacity
        onPress={() => navigation.navigate('Parent')}
        // Todo Bug does not effects to clicks and not goes to parent screen
        className="absolute top-6 left-4 px-2 flex-row items-center justify-center bg-gray-500 rounded-3xl">
        <Image
          source={require('../../assets/elements/arrow_back.png')}
          style={{width: hp(2), height: hp(2)}}
        />
        <Text className="text-white m-2" style={{fontSize: wp(3.5)}}>
          Back
        </Text>
      </TouchableOpacity>

      <ScrollView bounces={false}>
        <Text
          className="text-yellow-100 font-bold mx-auto tracking-widest "
          style={{fontSize: wp(7)}}>
          Story Name
        </Text>
        <Text className="text-yellow-100 pt-4" style={{fontSize: wp(4.5)}}>
          {storyResponse}
        </Text>
      </ScrollView>
    </View>
  );
}
