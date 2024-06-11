import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useHeaderHeight } from '@react-navigation/elements';
import { useHistoryStore } from '../utils/Store/historyStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';

interface Record {
  title: string;
  story: string;
  dateSaved: Date;
  image: string;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// todo: add loading spinner
export default function HistoryScreen() {
  const { history: storedHistory, removeHistoryItem } = useHistoryStore();
  const headerHeight = useHeaderHeight();

  const [history, setHistory] = useState<Record[]>([]);

  //Load history
  useEffect(() => {
    if (Array.isArray(storedHistory)) {
      setHistory(storedHistory);
    } else {
      console.log('Error: history data is not an array');
    }
  }, [storedHistory]);

  const handleDelete = (originalIndex: number) => {
    removeHistoryItem(originalIndex);
  };

  const handleRecordPress = (index: number) => {
    router.push({
      pathname: `/${index}`,
    });
  };
//todo: scrollView replace to flashList or flatList
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#2e304e', '#213f6a', '#301e51']}
        style={styles.background}>
        {/* <Text className=' absolute text-white text-3xl pt-20'>tottal recors: {history.length}</Text> */}
        <ScrollView bounces={false} contentContainerStyle={{ paddingTop: headerHeight }}>
          {Array.isArray(history) && history.length > 0 ? (
            history.slice().map((record: Record, index: number) => {
              return (
                <TouchableOpacity key={index} onPress={() => handleRecordPress(index)} style={styles.recordContainer}>
                  <View key={index} style={styles.recordContainer}>
                    <View style={styles.recordTextContainer}>
                      <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => handleDelete(index)}>
                          <Ionicons name="trash-bin-outline" size={20} color={'#fff'} style={styles.binIcon} />
                        </TouchableOpacity>
                      </View>
                      <Text numberOfLines={2} style={styles.recordTitle}>
                        {record.title}
                      </Text>

                      {/* {record.image ? (
                        <Image
                          source={{ uri: record.image }}
                          style={[
                            styles.image,
                          ]}
                        />
                      ) : null} */}
                      <View style={styles.storyContainer}>
                        <View style={styles.imageContainer}>
                          {record.image ? (
                            <Image
                              style={styles.image}
                              source={{ uri: record.image }}
                              placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
                              contentFit="cover"
                              transition={1000}
                            />
                          ) : null}
                        </View>
                        <View style={styles.textContainer}>
                          <Text numberOfLines={7} style={styles.recordStory}>
                            {record.story}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.recordDate}>{new Date(record.dateSaved).toLocaleString()}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.noHistoryContainer}>
              <Text style={styles.noHistoryText}>No history records found.</Text>
            </View>
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
  recordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  recordTextContainer: {
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  recordTitle: {
    color: '#FEF9C3',
    fontSize: wp(6.5),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  storyColumn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recordStory: {
    color: '#FEF9C3',
    paddingTop: 4,
    fontSize: wp(3.5),
    textAlign: 'justify',
  },
  recordDate: {
    color: '#FEF9C3',
    paddingTop: 4,
    fontSize: wp(3.5),
  },
  binIcon: {
    width: 24,
    height: 24,
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
  },
  noHistoryText: {
    color: '#FEF9C3',
    textAlign: 'center',
    fontSize: wp(5),
  },
  storyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  imageContainer: {
    flexBasis: '25%',
  },
  textContainer: {
    flexBasis: '75%',
    paddingLeft: 10,
  },
});
