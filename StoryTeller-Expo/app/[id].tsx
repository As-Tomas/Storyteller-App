import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useHistoryStore } from '@/utils/Store/historyStore'

const HistoryRecord = () => {

  const { id:index } = useLocalSearchParams<{ id: string }>();
  const history = useHistoryStore((state) => state.history);

  const recordId = index ? parseInt(index, 10) : undefined;

  const record = recordId !== undefined ? history[recordId] : undefined;

  if (!record) {
    return (
      <View>
        <Text>Record not found</Text>
      </View>
    );
  }

  const { title, story, dateSaved } = record;

  return (
    <View>
      <Text>Title: {title}</Text>
      <Text>Story: {story}</Text>
      <Text>Date Saved: {new Date(dateSaved).toLocaleString()}</Text>
    </View>
  );
};

export default HistoryRecord;