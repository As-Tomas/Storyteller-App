import { View, Text } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ErrorHandler = ({ label }: { label: string }) => {
  return (
    <LinearGradient className="flex-1 left-0 top-0 right-0 bottom-0" colors={['#2e304e', '#213f6a', '#301e51']}>
      <View className="flex-1 flex items-center justify-center ">
        <Text className="text-yellow-100" style={{ fontSize: wp(6) }}>
          {label}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default ErrorHandler;
