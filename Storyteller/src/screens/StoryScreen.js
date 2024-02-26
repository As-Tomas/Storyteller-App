import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

export default function StoryScreen() {
  const navigation = useNavigation();
  const [storyResponse, setStoryResponse] = useState('oOo');
  return (
    <View className="flex-1 bg-fuchsia-800 items-center p-5 pt-8 relative">
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}
        // Todo add navigation accordingly to parent or child
        className="absolute top-6 left-4 flex-row items-center justify-center bg-gray-500 rounded-3xl">
        <Image
          source={require('../../assets/elements/arrow_back.png')}
          style={{width: hp(2), height: hp(2)}}
        />
        <Text className="text-white m-2" style={{fontSize: wp(3.5)}}>
          Start
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
