import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useHeaderHeight } from '@react-navigation/elements';
import { useHistoryStore } from '../utils/Store/historyStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

interface Record {
  title: string;
  story: string;
  image: string;
  dateSaved: Date;
  audioData?: ArrayBuffer; 
}

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function HistoryScreen() {
  const { history: storedHistory, removeHistoryItem } = useHistoryStore();
  const headerHeight = useHeaderHeight();
  const [history, setHistory] = useState<Record[]>([]);

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
    // router.push(`/${index}`);
    router.navigate(`/${index}`);
  };

  const renderItem = ({ item, index }: { item: Record; index: number }) => (
    <TouchableOpacity key={index} onPress={() => handleRecordPress(index)} style={styles.recordContainer}>
      <View style={styles.recordTextContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleDelete(index)}>
            <Ionicons name="trash-bin-outline" size={20} color={'#fff'} style={styles.binIcon} />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={2} style={styles.recordTitle}>
          {item.title}
        </Text>
        <View style={styles.storyContainer}>
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image
                style={styles.image}
                source={{ uri: item.image }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            ) : null}
          </View>
          {item.audioData ? (
              <Text style={styles.recordStory}>🔊</Text>
            ) : null}
          <View style={styles.textContainer}>
            <Text numberOfLines={7} style={styles.recordStory}>
              {item.story}
            </Text>
          </View>
        </View>
        <Text style={styles.recordDate}>{new Date(item.dateSaved).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2e304e', '#213f6a', '#301e51']} style={styles.background}>
        {/* <TouchableOpacity onPress={clearHistory} style={styles.button}>
        <Text className=' text-white text-3xl pt-20'>tottal recors: {history.length}</Text>
        </TouchableOpacity> */}
        <FlashList
          data={history}
          renderItem={renderItem}
          estimatedItemSize={300}
          contentContainerStyle={{ paddingTop: headerHeight }}
          ListEmptyComponent={
            <View style={styles.noHistoryContainer}>
              <Text style={styles.noHistoryText}>No history records found.</Text>
            </View>
          }
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
    flex: 1,  // Ensures the background takes the full size of the container
  },
  button: {
    padding: 15,
    paddingTop: 30,
    alignItems: 'center',
    borderColor: '#fff',
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
