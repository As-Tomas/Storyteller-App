import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getLibraryChunk } from '@/apiCalls/supaWorker';
import ErrorHandler from '@/components/ErrorHandler';
import { router } from 'expo-router';
import { useLibraryStoryStore } from '@/utils/Store/libraryPrevStory';
interface LibraryItem {
  id: number;
  story: string;
  image: string;
  title: string;
  date: Date;
  audio_file_url: string;
}

export default function LibraryScreen() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchStories();
  }, [page]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const { success, data, msg } = (await getLibraryChunk({ page, pageSize })) as {
        success: boolean;
        data: Array<LibraryItem>;
        msg?: undefined;
      };
      if (success) {
        setStories((prev) => [...prev, ...data]);
      } else {
        //! todo: add popum message
        console.error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && stories.length < 20) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRecordPress = (item : LibraryItem) => {
    useLibraryStoryStore.setState({ libStory: item });
    
    router.push(`/${item.id}`); // library items id starts from 100 000
  };

  const renderItem = ({ item }: { item: LibraryItem;  }) => (
    <TouchableOpacity key={item.id} onPress={() => handleRecordPress(item)} >
      <View style={styles.recordTextContainer}>
        
        <Text numberOfLines={2} style={styles.recordTitle}>
          {item.title}
        </Text>
        <Text>item?.audio_file_url</Text>
        <View style={styles.storyContainer}>
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image
                style={styles.image}
                source={{ uri: item.image }}
                contentFit="cover"
                transition={1000}
              />
            ) : null}
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={7} style={styles.recordStory}>
              {item.story}
            </Text>
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );

  if (stories.length === 0 && !loading) {
    return <ErrorHandler label="Library is empty" />;
  }
  return (
    <LinearGradient className="flex-1 left-0 top-0 right-0 bottom-0" colors={['#2e304e', '#213f6a', '#301e51']}>
      <View className=" relative flex-1 flex items-center justify-center ">
        {loading && <ActivityIndicator className='absolute' size="large" color="#70945f" /> }        
          <FlatList
            data={stories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            style={{ paddingTop: 48 }}
          />
        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  recordStory: {
    color: '#FEF9C3',
    paddingTop: 4,
    fontSize: wp(3.5),
    textAlign: 'justify',
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
