import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  return (
    <TouchableOpacity
      className="relative p-2"
      onPress={() => {}}
    >
      <Feather name="bell" size={24} color="#4B5563" />
      {count > 0 && (
        <View className="absolute top-0 right-0 bg-red-500 rounded-full h-5 w-5 items-center justify-center">
          <Text className="text-white text-xs font-sans-bold">
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationBadge;
