import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getLibraryChunk } from '@/apiCalls/supaWorker';
import ErrorHandler from '@/components/ErrorHandler';

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

  const renderItem = ({ item }: { item: LibraryItem }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item?.title}</Text>
      <Image source={{ uri: item?.image }} style={styles.image} />
      <Text>{item?.story}</Text>
      <Text>{item?.date?.toString()}</Text>
      <Text>{item?.audio_file_url}</Text>
    </View>
  );

  if (stories.length === 0) {
    return (
      <ErrorHandler label='Library is empty' />        
    );
  }

  return (
    <LinearGradient className="flex-1 left-0 top-0 right-0 bottom-0" colors={['#2e304e', '#213f6a', '#301e51']}>
      <View className="flex-1 flex items-center justify-center ">
        <FlatList
          data={stories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
});
