import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useHeaderHeight } from '@react-navigation/elements';
import { useHistoryStore } from "../utils/Store/historyStore";

interface Record {
  title: string;
  story: string;
  dateSaved: Date;
  image: string;
}

export default function HistoryScreen() {
  const { history: storedHistory, removeHistoryItem } = useHistoryStore();
  const headerHeight = useHeaderHeight();

  const [history, setHistory] = useState<Record[]>([]);

  //Load history
  useEffect(() => {
    if (Array.isArray(storedHistory)) {
      setHistory(storedHistory);
    } else {
      console.log("Error: history data is not an array");
    }
  }, [storedHistory]);

  const handleDelete = (index: number) => {
    removeHistoryItem(index);
  };

  return (
    <View style={styles.container}>      
      <ScrollView bounces={false} contentContainerStyle={{ paddingTop: headerHeight }}>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((record: Record, index: number) => (
            <View key={index} style={styles.recordContainer}>
              <View style={styles.recordTextContainer}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordStory}>{record.story}</Text>
                <Text style={styles.recordDate}>{record.dateSaved.toString()}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                {/* <Image
                  source={require("@/assets/elements/bin_icon.png")} // Ensure you have a bin_icon.png in your assets
                  style={styles.binIcon}
                /> */}
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noHistoryText}>No history records found.</Text>
        )}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "slategray",
    paddingTop: 16,
  },
  recordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  recordTextContainer: {
    flex: 1,
  },
  recordTitle: {
    color: "#FFFF00",
    fontSize: wp(4.5),
  },
  recordStory: {
    color: "#FFFF00",
    paddingTop: 4,
    fontSize: wp(4.5),
  },
  recordDate: {
    color: "#FFFF00",
    paddingTop: 4,
    fontSize: wp(4.5),
  },
  binIcon: {
    width: 24,
    height: 24,
  },
  noHistoryText: {
    color: "#FFFF00",
    textAlign: "center",
    fontSize: wp(5),
  },
});