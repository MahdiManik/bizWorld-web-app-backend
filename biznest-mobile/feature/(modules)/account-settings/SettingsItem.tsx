import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import cn from '@/lib/utils';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  badge?: 'free' | 'premium';
  route?: string;
  onPress?: () => void;
  textColor?: string;
}
const SettingsItem = ({
  route,
  icon,
  title,
  badge,
  onPress,
  textColor,
}: SettingsItemProps) => (
  <TouchableOpacity
    className="flex-row items-center justify-between bg-white py-4"
    onPress={() => {
      if (route) {
        router.push(route as any);
      } else if (onPress) {
        onPress();
      }
    }}
    activeOpacity={0.4}
  >
    <View className="flex-1 flex-row items-center">
      <View className="mr-3 h-6 w-6 items-center justify-center">{icon}</View>
      <Text
        className={cn(
          'flex-1 font-roboto400 text-base',
          textColor ? textColor : 'text-subtle'
        )}
      >
        {title}
      </Text>
      {badge && (
        <View className="mr-2 rounded-full bg-yellow-400 px-2 py-1">
          <Text className="text-xs font-medium text-black">{badge}</Text>
        </View>
      )}
    </View>
    <Entypo name="chevron-thin-right" size={18} color="black" />
  </TouchableOpacity>
);

export default SettingsItem;
