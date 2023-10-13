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
import Slider from '@react-native-community/slider';

export default function ParentScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [sliderValue, setSliderValue] = useState(1);
  const [sliderStoryLenght, setsliderStoryLenght] = useState(0);

  const getStoryLengthString = value => {
    switch (Math.round(value)) {
      case 1:
        return 'Short';
      case 2:
        return 'Medium';
      case 3:
        return 'Large';
      default:
        return 'Short';
    }
  };

  return (
    <View className="flex-1 bg-fuchsia-800 items-center justify-center relative">
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}
        className="absolute top-6 left-4 flex-row items-center justify-center">
        <Image
          source={require('../../assets/elements/arrow_back.png')}
          style={{width: hp(2), height: hp(2)}}
        />
        <Text className="text-white" tyle={{fontSize: wp(2)}}>
          Start
        </Text>
      </TouchableOpacity>

      <Text
        className="text-white text-center font-bold absolute top-6"
        style={{fontSize: wp(6)}}>
        Define your story
      </Text>

      <View className="absolute bottom-6 items-center justify-center  ">
          <TouchableOpacity
            onPress={() => navigation.navigate('Story')}
            className="bg-[#F3A467] m-2 py-2 rounded-full flex items-center justify-center"
            style={{width: wp(55)}}>
            <Text
              className="text-yellow-100 font-semibold"
              style={{fontSize: wp(5)}}>
              Create your story
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Story')}
            className="bg-[#F3A467] m-2 py-2 rounded-full flex items-center justify-center"
            style={{width: wp(55)}}>
            <Text
              className="text-yellow-100 font-semibold"
              style={{fontSize: wp(5)}}>
              Create random story
            </Text>
          </TouchableOpacity>

        </View>

      <ScrollView className="absolute top-20 flex-1 w-11/12 ">
        <View className="">
          {/* Row 1 */}
          <View className="flex-row justify-evenly ">
            <Text className="text-white mb-1" style={{fontSize: wp(4)}}>
              Child’s name:
            </Text>
            <Text className="text-white mb-1" style={{fontSize: wp(4)}}>
              Story language:
            </Text>
          </View>

          {/* Row 2 */}
          <View className="flex-row justify-evenly ">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Name"
              placeholderTextColor="white"
              style={{color: 'white'}}
              className="w-2/5 px-4  rounded border border-gray-300 "
            />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="English"
              placeholderTextColor="white"
              style={{color: 'white'}}
              className="w-2/5 px-4 py-2 rounded border border-gray-300 "
            />
          </View>
        </View>

        <View>
          <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
            Child’s age: {Math.round(sliderValue)} year
          </Text>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Slider
              style={{width: wp(90), height: 40}}
              minimumValue={1}
              maximumValue={10}
              onValueChange={value => setSliderValue(value)}
              minimumTrackTintColor="#D9D9D9"
              maximumTrackTintColor="#000000"
              thumbTintColor="#D9D9D9"
            />
          </View>
        </View>

        <View>
          <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
            Story length: {getStoryLengthString(sliderStoryLenght)}
          </Text>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Slider
              style={{width: wp(90), height: 40}}
              minimumValue={1}
              maximumValue={3}
              onValueChange={value => setsliderStoryLenght(value)}
              minimumTrackTintColor="#D9D9D9"
              maximumTrackTintColor="#000000"
              thumbTintColor="#D9D9D9"
            />
          </View>
        </View>

        <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
          What do you want to motivate the child?
        </Text>

        <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
          Specifi motivation:
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="To do homework"
          placeholderTextColor="white"
          style={{color: 'white', marginHorizontal: 10}}
          className="px-4  rounded border border-gray-300 "
        />

        <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
          Describe story characters, location, actions and etc...
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Spiderman in Bergen"
          placeholderTextColor="white"
          style={{color: 'white', marginHorizontal: 10}}
          className="px-4 rounded border border-gray-300 "
        />

        
      </ScrollView>
    </View>
  );
}
