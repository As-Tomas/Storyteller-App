import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Slider from '@react-native-community/slider';
import LanguageSelector from '../components/languageSelect';
import UserTextInput from '../components/UserTextInput';
import NetInfo from '@react-native-community/netinfo';
import { chatgptApiCall } from '../apiCalls/openAI';
import { generatePrompt } from '../components/promptGenerator';
import { router } from 'expo-router';
import { useSettingsStore } from '../utils/Store/settingsStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import ButtonActionStyled from '@/components/ButtonActionStyled';
import { SegmentedControl } from '@/components/SettingsComponents/SegmentedControl';

export default function ParentScreen() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [languageLabel, setLanguageLabel] = useState('');
  const [age, setAge] = useState(1);
  const [length, setLength] = useState(0);
  const [motivation, setMotivation] = useState('');
  const [storyComponents, setStoryComponents] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userInputText, setUserInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState('');

  const headerHeight = useHeaderHeight();

  const { settingsData, updateSettings, recentStory, setRecentStory, setRecentStoryTitle } = useSettingsStore(
    (state) => ({
      settingsData: state.settingsData,
      updateSettings: state.updateSettings,
      recentStory: state.recentStory,
      setRecentStory: state.setRecentStory,
      setRecentStoryTitle: state.setRecentStoryTitle,
    }),
  );

  const initialRender = useRef(true);

  // Check for internet connectivity
  useEffect(() => {
    const checkInternetConnection = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('No internet connection');
        Alert.alert('No internet connection', 'Please check your internet connection and try again.');
      }
    };

    checkInternetConnection();
  }, []);

  // Load settings data
  useEffect(() => {
    if (settingsData) {
      setName(settingsData.name);
      setLanguage(settingsData.language);
      setLanguageLabel(settingsData.languageLabel);
      setAge(settingsData.age);
      setLength(settingsData.length);
      setMotivation(settingsData.motivation);
      setStoryComponents(settingsData.storyComponents);
    }
  }, [settingsData]);

  // Save settings data
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      const newData = {
        name,
        language,
        languageLabel,
        age,
        length,
        motivation,
        storyComponents,
      };

      updateSettings(newData);
    }
  }, [name, language, languageLabel, age, length, motivation, storyComponents, updateSettings]);

  const fetchResponse = async (userInput: string) => {
    if (userInput.trim().length > 0) {
      setLoading(true);
      const newUserRequest = userInput.trim();
      const prompt = generatePrompt(newUserRequest, settingsData);
      console.log('prompt', prompt);

      try {
        const res = await chatgptApiCall(prompt);
        setLoading(false);
        if (res.success) {
          setStory(res.data);
        } else {
          Alert.alert('Error', res.msg);
        }
        console.log('🚀 ~ chatgptApiCall ~ res.data:', res.data);
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const triggerFetch = () => {
    fetchResponse(userInputText);
  };

  useEffect(() => {
    if (story) {
      const title = userInputText.split(' ').slice(0, 5).join(' '); // just first 5 words as title
      setRecentStory(story);
      setRecentStoryTitle(title);
      router.replace('ChildScreen');
      setStory('');
      setLoading(false);
    }
  }, [story, setRecentStory]);

  const renderListItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'inputChildName':
        return (
          <View style={styles.row}>
            <Text style={[styles.text, styles.label]}>Child’s name:</Text>
            <View style={styles.row}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="gray"
                style={styles.textInput}
              />
            </View>
          </View>
        );
      case 'language':
        return (
          <>
            <Text style={[styles.text, styles.label]}>Story language:</Text>
            <LanguageSelector language={language} setLanguage={setLanguage} setLanguageLabel={setLanguageLabel} />
          </>
        );
      case 'age':
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>Child’s age: {Math.round(age)} year</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={7}
                value={age || 2}
                onValueChange={(value) => setAge(Math.round(value))}
                minimumTrackTintColor="#D9D9D9"
                maximumTrackTintColor="#000000"
                thumbTintColor="#D9D9D9"
              />
            </View>
          </>
        );
      case 'length':
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>Story length</Text>
            <SegmentedControl
              values={['short', 'medium', 'large']}
              selectedIndex={length}
              onChange={(event) => setLength(event.nativeEvent.selectedSegmentIndex)}
            />
          </>
        );
      case 'motivation':
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>What do you want to motivate the child?</Text>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>State the motivation:</Text>
            <TextInput
              value={motivation}
              onChangeText={setMotivation}
              placeholder="To do homework"
              placeholderTextColor="gray"
              style={[styles.textInput, { marginHorizontal: 10 }]}
            />
          </>
        );
      case 'storyComponents':
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>
              Describe story characters, location, actions and etc...
            </Text>
            <TextInput
              value={storyComponents}
              onChangeText={setStoryComponents}
              placeholder="Spiderman in Bergen"
              placeholderTextColor="gray"
              style={[styles.textInput, { marginHorizontal: 10 }]}
            />
          </>
        );
      case 'userInput':
        return <UserTextInput setUserInputText={setUserInputText} setup={'parent'} fetchResponse={triggerFetch} />;
      case 'actionButtons':
        return (
          <>
            {loading ? (
              <Image source={require('@/assets/elements/loading.gif')} style={styles.loadingGif} />
            ) : (
              <View style={styles.buttonsContainer}>
                <ButtonActionStyled text="Create your story" onPress={() => triggerFetch()} />
              </View>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const data = [
    { type: 'language' },
    { type: 'age' },
    { type: 'length' },
    { type: 'inputChildName' },
    { type: 'motivation' },
    { type: 'storyComponents' },
    { type: 'userInput' },
    { type: 'actionButtons' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#2e304e', '#213f6a', '#301e51']}
        style={styles.background}>
        <FlashList
          data={data}
          renderItem={renderListItem}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingTop: headerHeight }}
          keyExtractor={(item, index) => index.toString()}
          // onScrollBeginDrag={() => Keyboard.dismiss()}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingTop: hp(2),
    paddingLeft: wp(3),
    paddingRight: wp(3),
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: wp(6),
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: 'white',
  },
  label: {
    fontSize: wp(3.5),
  },
  textInput: {
    width: wp(60),
    paddingHorizontal: 16,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: wp(90),
    height: 40,
  },
  loadingGif: {
    borderRadius: 9999,
    alignSelf: 'center',
    marginTop: 20,
    width: hp(10),
    height: hp(10),
  },
});
