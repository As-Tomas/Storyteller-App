import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { readData } from "../utils/storage";
import { router } from "expo-router";
import { useSettingsStore } from "../utils/Store/settingsStore";

interface Record {
  title: string;
  story: string;
  dateSaved: Date;
  image: string;
}

export default function HistoryScreen() {
  const { history: storedHistory } = useSettingsStore();

  const [history, setHistory] = useState<Record[]>([]);

  //Load history
  useEffect(() => {
    if (Array.isArray(storedHistory)) {
      setHistory(storedHistory);
    } else {
      console.log("Error: history data is not an array");
    }
  }, [storedHistory]);

  return (
    <View className="flex-1 bg-fuchsia-800 items-center p-5 pt-8 relative">
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="absolute z-50 top-6 left-4 flex-row items-center justify-center bg-gray-500 rounded-3xl"
      >
        <Image
          source={require("@/assets/elements/arrow_back.png")}
          style={{ width: hp(2), height: hp(2) }}
        />
        <Text className="text-white m-2" style={{ fontSize: wp(3.5) }}>
          Start
        </Text>
      </TouchableOpacity>

      <ScrollView bounces={false}>
        <Text
          style={{
            color: "#FFFF00",
            fontWeight: "bold",
            alignSelf: "center",
            letterSpacing: 3,
            fontSize: wp(7),
          }}
        >
          Your History
        </Text>
        {Array.isArray(history) &&
          history.map((record: Record, index: number) => (
            <View key={index}>
              <Text
                style={{ color: "#FFFF00", paddingTop: 4, fontSize: wp(4.5) }}
              >
                {record.title}
              </Text>
              <Text
                style={{ color: "#FFFF00", paddingTop: 4, fontSize: wp(4.5) }}
              >
                {record.story}
              </Text>
              <Text
                style={{ color: "#FFFF00", paddingTop: 4, fontSize: wp(4.5) }}
              >
                {record.dateSaved.toString()}
              </Text>
              {/* <Image
                source={{ uri: record.image }}
                style={{ width: 100, height: 100 }}
              /> */}
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
