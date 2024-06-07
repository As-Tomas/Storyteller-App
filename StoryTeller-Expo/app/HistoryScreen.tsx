import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useHeaderHeight } from '@react-navigation/elements';
import { useHistoryStore } from "../utils/Store/historyStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
        // Background Linear Gradient
        colors={['#2e304e', '#213f6a', '#301e51',]}
        style={styles.background}
      >
      

      <ScrollView bounces={false} contentContainerStyle={{ paddingTop: headerHeight }}>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((record: Record, index: number) => (
            <View key={index} style={styles.recordContainer}>
              <View style={styles.recordTextContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleDelete(index)}>
                    <Ionicons name="trash-bin-outline" size={20} color={'#fff'} style={styles.binIcon}/>
                  </TouchableOpacity>
                </View>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordStory}>{record.story}</Text>
                <Text style={styles.recordDate}>{record.dateSaved.toString()}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noHistoryText}>No history records found.</Text>
        )}
      </ScrollView>
      </LinearGradient>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
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
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  recordTitle: {
    color: "#FFFFff",
    fontSize: wp(8.5),
    textAlign: 'center',
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  recordStory: {
    color: "#FFFFff",
    paddingTop: 4,
    fontSize: wp(4.5),
    textAlign: 'justify',
  },
  recordDate: {
    color: "#FFFFFF",
    paddingTop: 4,
    fontSize: wp(4.5),
  },
  binIcon: {
    width: 24,
    height: 24,
  },
  noHistoryText: {
    color: "#FFFFff",
    textAlign: "center",
    fontSize: wp(5),
  },
});