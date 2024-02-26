import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import LanguageSelector from '../components/languageSelect';
import DataContext from '../components/DataContext';
import {writeData} from '../components/readWriteData';

export default function ParentScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [age, setAge] = useState(1);
  const [length, setLength] = useState(1);
  const [motivation, setMotivation] = useState('');
  const [storyComponents, setStoryComponents] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // const settingsData = settingsData;
  // console.log('first', settingsData)
  const {userSettings, update: updateUserSettings} = useContext(DataContext);
  console.log('userSettings*', userSettings);

  useEffect(() => {
    (async () => {
      // const storedData = await readData('userData');
      if (userSettings) {
        setName(userSettings.name);
        setLanguage(userSettings.language);
        setAge(userSettings.age);
        setLength(userSettings.length);
        setMotivation(userSettings.motivation);
        setStoryComponents(userSettings.storyComponents);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const newData = {
        name,
        language,
        age,
        length,
        motivation,
        storyComponents,
      };
      await writeData('userData', newData);
      updateUserSettings(newData);
    })();
  }, [name, language, age, length, motivation, storyComponents]);

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView //! not finished, doesn't work
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View className="flex-1 bg-fuchsia-800 items-center justify-center relative">
        <TouchableOpacity
          onPress={() => navigation.navigate('Welcome')}
          className="absolute top-6 left-4 px-2 flex-row items-center justify-center bg-gray-500 rounded-3xl">
          <Image
            source={require('../../assets/elements/arrow_back.png')}
            style={{width: hp(2), height: hp(2)}}
          />
          <Text className="text-white  m-2" style={{fontSize: wp(3.5)}}>
            Start
          </Text>
        </TouchableOpacity>

        <Text
          className="text-white text-center font-bold absolute top-6"
          style={{fontSize: wp(6)}}>
          Define your story
        </Text>

        {!keyboardVisible && (
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
        )}

        <ScrollView bounces={false} className="absolute top-20 flex-1 w-11/12 ">
          <View className="">
            <View className="flex-row  ">
              <Text className="text-white mb-1" style={{fontSize: wp(4)}}>
                Child’s name:
              </Text>
              <View className="flex-row  ">
                <TextInput
                  value={name}
                  onChangeText={text => setName(text)}
                  placeholder="Name"
                  placeholderTextColor="white"
                  style={{color: 'white'}}
                  className="w-3/5 px-4  rounded border border-gray-300 "
                />
              </View>
            </View>
            <Text className="text-white mb-1" style={{fontSize: wp(4)}}>
              Story language:
            </Text>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </View>

          <View>
            <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
              Child’s age: {Math.round(age)} year
            </Text>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Slider
                style={{width: wp(90), height: 40}}
                minimumValue={1}
                maximumValue={10}
                onValueChange={value => setAge(Math.round(value))}
                minimumTrackTintColor="#D9D9D9"
                maximumTrackTintColor="#000000"
                thumbTintColor="#D9D9D9"
              />
            </View>
          </View>

          <View>
            <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
              Story length: {getStoryLengthString(length)}
            </Text>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Slider
                style={{width: wp(90), height: 40}}
                minimumValue={1}
                maximumValue={3}
                onValueChange={value => setLength(Math.round(value))}
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
            value={motivation}
            onChangeText={text => setMotivation(text)}
            placeholder="To do homework"
            placeholderTextColor="white"
            style={{color: 'white', marginHorizontal: 10}}
            className="px-4  rounded border border-gray-300 "
          />

          <Text className="text-white mt-4 ml-4" style={{fontSize: wp(4)}}>
            Describe story characters, location, actions and etc...
          </Text>
          <TextInput
            value={storyComponents}
            onChangeText={text => setStoryComponents(text)}
            placeholder="Spiderman in Bergen"
            placeholderTextColor="white"
            style={{color: 'white', marginHorizontal: 10}}
            className="px-4 rounded border border-gray-300 "
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
