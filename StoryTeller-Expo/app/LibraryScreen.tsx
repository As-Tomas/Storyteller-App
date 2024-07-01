import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ImageBackground, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getLibraryChunk } from '@/apiCalls/supaWorker';
import ErrorHandler from '@/components/ErrorHandler';
import { router } from 'expo-router';
import { useLibraryStoryStore } from '@/utils/Store/libraryPrevStory';
import { FontAwesome } from '@expo/vector-icons';

interface LibraryItem {
  id: number;
  story: string;
  image: string;
  title: string;
  date: Date;
  audioData: string;
}

interface IncomingLibraryItem {
  id: number;
  story: string;
  image: string;
  title: string;
  date: Date;
  audio_file_url: string;
}

function transformToLibraryItem(incomingItem: IncomingLibraryItem): LibraryItem {
  return {
    id: incomingItem.id,
    story: incomingItem.story,
    image: incomingItem.image,
    title: incomingItem.title,
    date: incomingItem.date,
    audioData: incomingItem.audio_file_url,
  };
}

export default function LibraryScreen() {
  const [stories, setStories] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    fetchStories();
  }, [page]);

  const fetchStories = async () => {
    if (loading || !hasMore) return; // Prevent fetching if already loading or no more items

    setLoading(true);
    try {
      const { success, data, msg } = (await getLibraryChunk({ page, pageSize })) as {
        success: boolean;
        data: IncomingLibraryItem[];
        msg?: string;
      };
      if (success) {
        const libraryItems = data.map(transformToLibraryItem);

        // fetched stories
        // console.log(
        //   'Fetched stories:',
        //   libraryItems.map((item) => item.id),
        // );

        // Check if there are more items to load
        if (libraryItems.length < pageSize) {
          setHasMore(false);
        }

        // Merge new items while ensuring no duplicates
        const uniqueStories = Array.from(
          new Map([...stories, ...libraryItems].map((item) => [item.id, item])).values(),
        );

        // console.log(
        //   'Unique stories after merge:',
        //   uniqueStories.map((item) => item.id),
        // );

        setStories(uniqueStories);
      } else {
        console.error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRecordPress = (item: LibraryItem) => {
    useLibraryStoryStore.setState({ libStory: item });
    router.push(`/${item.id}`);
  };

  const renderItem = ({ item, index }: { item: LibraryItem; index: number }) => {
    return (
      <TouchableOpacity key={item.id.toString()} onPress={() => handleRecordPress(item)} style={styles.itemContainer}>
        <ImageBackground source={{ uri: item.image }} style={styles.imageBackground}>
          <View style={styles.topLeftIcon}>
            {item.audioData && <FontAwesome name="volume-up" size={20} color="#ffffff" />}
          </View>
          <View style={styles.topRightLabel}>
            {/* // todo add content restriction */}
            {item.audioData ? (
              <Text style={styles.freeText}>FREE</Text>
            ) : (
              <FontAwesome name="lock" size={20} color="#ffffff" />
            )}
          </View>
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.bottomGradient}>
            <View style={styles.bottomLeftTitle}>
              <Text style={styles.recordTitle} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (stories.length === 0 && !loading) {
    return <ErrorHandler label="Library is empty" />;
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={['#2e304e', '#213f6a', '#301e51']}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          position: 'relative',
        }}>
        <FlatList
          data={stories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.contentContainerStyle}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#70945f" /> : null}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 50,
    paddingTop: 140,
    paddingHorizontal: wp(2),
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: '2%',
    marginLeft: '2%',
    marginRight: '2%',
  },
  itemContainer: {
    flexBasis: '48%',
    margin: '1%',
    backgroundColor: 'transparent',
  },
  imageBackground: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    width: wp(44),
    height: wp(30),
    justifyContent: 'center',
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  topLeftIcon: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomRightRadius: 8,
    padding: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightLabel: {
    width: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 8,
    padding: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
  },
  freeText: {
    color: 'white',
    marginRight: 5,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bottomLeftTitle: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    right: 5,
  },
  recordTitle: {
    color: '#FEF9C3',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
});
