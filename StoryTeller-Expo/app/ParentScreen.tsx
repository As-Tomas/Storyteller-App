import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Slider from "@react-native-community/slider";
import LanguageSelector from "../components/languageSelect";
import UserTextInput from "../components/UserTextInput";
import NetInfo from "@react-native-community/netinfo";
import { chatgptApiCall } from "../apiCalls/openAI";
import { generatePrompt } from "../components/promptGenerator";
import { router } from "expo-router";
import { useSettingsStore } from "../utils/Store/settingsStore";
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
    const checkInternetConnection = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log("No internet connection");
        Alert.alert(
          "No internet connection",
          "Please check your internet connection and try again."
        );
      }
    };

    checkInternetConnection();
  }, []);

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

  const fetchResponse = async (userInput: string) => {
    if (userInput.trim().length > 0) {
      setLoading(true);
      const newUserRequest = userInput.trim();
      const prompt = generatePrompt(newUserRequest, settingsData);
      console.log("prompt", prompt);

      try {
        const res = await chatgptApiCall(prompt);
        setLoading(false);
        if (res.success) {
          setStory(res.data);
        } else {
          Alert.alert("Error", res.msg);
        }
        console.log("🚀 ~ chatgptApiCall ~ res.data:", res.data);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  const triggerFetch = () => {
    fetchResponse(userInputText);
  };

  useEffect(() => {
    if (story) {
      router.push("ChildScreen");
      setRecentStory(story);
    }
  }, [story, setRecentStory]);

  const renderListItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "title":
        return (
          <Text style={styles.title}>Define your story</Text>
        );
      case "input":
        return (
          <View style={styles.row}>
            <Text style={[styles.text, styles.label]}>Child’s name:</Text>
            <View style={styles.row}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="white"
                style={styles.textInput}
              />
            </View>
          </View>
        );
      case "language":
        return (
          <>
            <Text style={[styles.text, styles.label]}>Story language:</Text>
            <LanguageSelector
              language={language}
              setLanguage={setLanguage}
              setLanguageLabel={setLanguageLabel}
            />
          </>
        );
      case "age":
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>
              Child’s age: {Math.round(age)} year
            </Text>
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
      case "length":
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>
              Story length: {getStoryLengthString(length)}
            </Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={3}
                value={length || 1}
                onValueChange={(value) => setLength(Math.round(value))}
                minimumTrackTintColor="#D9D9D9"
                maximumTrackTintColor="#000000"
                thumbTintColor="#D9D9D9"
              />
            </View>
          </>
        );
      case "motivation":
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>
              What do you want to motivate the child?
            </Text>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>
              State the motivation:
            </Text>
            <TextInput
              value={motivation}
              onChangeText={setMotivation}
              placeholder="To do homework"
              placeholderTextColor="white"
              style={[styles.textInput, { marginHorizontal: 10 }]}
            />
          </>
        );
      case "storyComponents":
        return (
          <>
            <Text style={[styles.text, styles.label, { marginTop: 16 }]}>
              Describe story characters, location, actions and etc...
            </Text>
            <TextInput
              value={storyComponents}
              onChangeText={setStoryComponents}
              placeholder="Spiderman in Bergen"
              placeholderTextColor="white"
              style={[styles.textInput, { marginHorizontal: 10 }]}
            />
          </>
        );
      case "userInput":
        return (
          <UserTextInput setUserInputText={setUserInputText} setup={"parent"} />
        );
      case "userInputu":
        return (
          <>
          {!keyboardVisible && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => triggerFetch()}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Create your story</Text>
                  </TouchableOpacity>
        
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Create random story</Text>
                  </TouchableOpacity>
                </View>
              )}
          </>
        );
      
        
      default:
        return null;
    }
  };

  const data = [
    { type: "title" },
    { type: "input" },
    { type: "language" },
    { type: "age" },
    { type: "length" },
    { type: "motivation" },
    { type: "storyComponents" },
    { type: "userInput" },
    { type: "userInputu" },
  ];

  return (    
    <View style={styles.container}>
      <FlashList
        data={data}
        renderItem={renderListItem}
        estimatedItemSize={200}
        contentContainerStyle={styles.flashListContent}
        keyExtractor={(item, index) => index.toString()}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        style={{ flex: 1 }}
      />
      </View>
  );
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "slategray",
    // alignItems: "center",
    // justifyContent: "center",
    paddingTop: hp(6), // Ensure enough top padding for the title
    paddingLeft: wp(3),
    paddingRight: wp(3),
  },
  backButton: {
    position: "absolute",
    top: hp(6),
    left: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
    borderRadius: 24,
    padding: 4,
  },
  backIcon: {
    width: hp(2),
    height: hp(2),
  },
  backText: {
    color: "white",
    marginLeft: 8,
    fontSize: wp(3.5),
  },
  title: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: wp(6),
    // position: "absolute",
    // top: hp(6),
  },
  buttonsContainer: {
    // position: "absolute",
    // bottom: hp(6),
    alignItems: "center",
    // justifyContent: "center",
  },
  button: {
    backgroundColor: "#F3A467",
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    width: wp(55),
  },
  buttonText: {
    color: "#FFFFE0",
    fontWeight: "600",
    fontSize: wp(5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  text: {
    color: "white",
  },
  label: {
    fontSize: wp(4),
  },
  textInput: {
    width: wp(60),
    paddingHorizontal: 16,
    borderRadius: 4,
    borderColor: "gray",
    borderWidth: 1,
    color: "white",
  },
  sliderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: wp(90),
    height: 40,
  },
  flashListContent: {
    backgroundColor: "slategray",
    // paddingTop: hp(6),
  },
});
