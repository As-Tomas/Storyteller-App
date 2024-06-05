import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Slider from "@react-native-community/slider";
import LanguageSelector from "../components/languageSelect";
import UserTextInput from "../components/UserTextInput";
import NetInfo from "@react-native-community/netinfo";
import { getImagePrompt, chatgptApiCall } from "../apiCalls/openAI";
import { generatePrompt } from "../components/promptGenerator";
import { router } from "expo-router";
import { useSettingsStore } from "../utils/Store/settingsStore";
import { Platform } from "react-native";
import { Image } from "expo-image";

export default function ParentScreen() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [languageLabel, setLanguageLabel] = useState("");
  const [age, setAge] = useState(1);
  const [length, setLength] = useState(1);
  const [motivation, setMotivation] = useState("");
  const [storyComponents, setStoryComponents] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userInputText, setUserInputText] = useState("");

  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");

  const { settingsData, updateSettings, recentStory, setRecentStory } =
    useSettingsStore((state) => ({
      settingsData: state.settingsData,
      updateSettings: state.updateSettings,
      recentStory: state.recentStory,
      setRecentStory: state.setRecentStory,
    }));

  useEffect(() => {
    (async () => {
      // Check for internet connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log("No internet connection");
        Alert.alert(
          "No internet connection",
          "Please check your internet connection and try again."
        );
        return;
      }
    })();
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
  }, []);

  // Save settings data
  useEffect(() => {
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
  }, [
    name,
    language,
    languageLabel,
    age,
    length,
    motivation,
    storyComponents,
    updateSettings,
  ]);

  const getStoryLengthString = (value: number) => {
    switch (Math.round(value)) {
      case 1:
        return "Short";
      case 2:
        return "Medium";
      case 3:
        return "Large";
      default:
        return "Short";
    }
  };

  const fetchResponse = (userInput: string) => {
    try {
      if (userInput.trim().length > 0) {
        setLoading(true);
        let newUserRequest = userInput.trim();
        let prompt = generatePrompt(newUserRequest, settingsData);
        console.log("prompt", prompt);

        chatgptApiCall(prompt).then((res) => {
          setLoading(false);
          if (res.success) {
            setStory(res.data);
          } else {
            Alert.alert("Error", res.msg);
          }
          console.log("🚀 ~ chatgptApiCall ~ res.data:", res.data);
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (story) {
      // writeData('history', {title: 'title', story: story, image: 'image'});
      //beafore navigation to story screen save existing story to history
      router.push("StoryScreen");
      setRecentStory(story, "title");
    }
  }, [story]);

  const trigerFetch = () => {
    fetchResponse(userInputText);
  };

  return (
    // <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === "ios" ? "padding" : "height"}>
    //     <ScrollView className='flex-1  bg-gradient-to-b from-gray-800 via-black to-gray-800' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

    <View className="flex-1 bg-slate-500  items-center justify-center relative">
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="absolute top-6 left-4 px-2 flex-row items-center justify-center bg-gray-500 rounded-3xl"
      >
        <Image
          source={require("@/assets/elements/arrow_back.png")}
          style={{ width: hp(2), height: hp(2) }}
        />
        <Text className="text-white  m-2" style={{ fontSize: wp(3.5) }}>
          Start
        </Text>
      </TouchableOpacity>

      <Text
        className="text-white text-center font-bold absolute top-6"
        style={{ fontSize: wp(6) }}
      >
        Define your story
      </Text>

      {!keyboardVisible && (
        <View className="absolute bottom-6 items-center justify-center  ">
          <TouchableOpacity
            onPress={() => trigerFetch()}
            className="bg-[#F3A467] m-2 py-2 rounded-full flex items-center justify-center"
            style={{ width: wp(55) }}
          >
            <Text
              className="text-yellow-100 font-semibold"
              style={{ fontSize: wp(5) }}
            >
              Create your story
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            //   onPress={() =>
            //     navigation.navigate('Story', {userInput: ' random story'})
            //   }
            className="bg-[#F3A467] m-2 py-2 rounded-full flex items-center justify-center"
            style={{ width: wp(55) }}
          >
            <Text
              className="text-yellow-100 font-semibold"
              style={{ fontSize: wp(5) }}
            >
              Create random story
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView bounces={false} className="absolute top-20 flex-1 w-11/12 ">
        <View className="">
          <View className="flex-row  ">
            <Text className="text-white mb-1" style={{ fontSize: wp(4) }}>
              Child’s name:
            </Text>
            <View className="flex-row  ">
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Name"
                placeholderTextColor="white"
                style={{ color: "white" }}
                className="w-3/5 px-4  rounded border border-gray-300 "
              />
            </View>
          </View>
          <Text className="text-white mb-1" style={{ fontSize: wp(4) }}>
            Story language:
          </Text>
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
            setLanguageLabel={setLanguageLabel}
          />
        </View>

        <View>
          <Text className="text-white mt-4 ml-4" style={{ fontSize: wp(4) }}>
            Child’s age: {Math.round(age)} year
          </Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Slider
              style={{ width: wp(90), height: 40 }}
              minimumValue={1}
              maximumValue={7}
              value={age || 2}
              onValueChange={(value) => setAge(Math.round(value))}
              minimumTrackTintColor="#D9D9D9"
              maximumTrackTintColor="#000000"
              thumbTintColor="#D9D9D9"
            />
          </View>
        </View>

        <View>
          <Text className="text-white mt-4 ml-4" style={{ fontSize: wp(4) }}>
            Story length: {getStoryLengthString(length)}
          </Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Slider
              style={{ width: wp(90), height: 40 }}
              minimumValue={1}
              maximumValue={3}
              value={length || 1}
              onValueChange={(value) => setLength(Math.round(value))}
              minimumTrackTintColor="#D9D9D9"
              maximumTrackTintColor="#000000"
              thumbTintColor="#D9D9D9"
            />
          </View>
        </View>

        <Text className="text-white mt-4 ml-4" style={{ fontSize: wp(4) }}>
          What do you want to motivate the child?
        </Text>

        <Text className="text-white mt-4 ml-4" style={{ fontSize: wp(4) }}>
          State the motivation:
        </Text>
        <TextInput
          value={motivation}
          onChangeText={(text) => setMotivation(text)}
          placeholder="To do homework"
          placeholderTextColor="white"
          style={{ color: "white", marginHorizontal: 10 }}
          className="px-4  rounded border border-gray-300 "
        />

        <Text className="text-white mt-4 ml-4" style={{ fontSize: wp(4) }}>
          Describe story characters, location, actions and etc...
        </Text>
        <TextInput
          value={storyComponents}
          onChangeText={(text) => setStoryComponents(text)}
          placeholder="Spiderman in Bergen"
          placeholderTextColor="white"
          style={{ color: "white", marginHorizontal: 10 }}
          className="px-4 rounded border border-gray-300 "
        />
        <UserTextInput setUserInputText={setUserInputText} setup={"parent"} />
      </ScrollView>
    </View>
    //      </ScrollView>
    //    </KeyboardAvoidingView>
  );
}
