import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Switch } from 'react-native-paper';
import colors from '@/constants/colors';

interface NotificationItemProps {
  title: string;
  description: string;
}
const NotificationItem = ({ title, description }: NotificationItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="flex-row items-end justify-between">
      <View className="flex-1 gap-2">
        <Text className="font-roboto500 text-base text-subtle">{title}</Text>
        <Text className="font-roboto400 text-sm text-description-text">
          {description}
        </Text>
      </View>
      <Switch
        value={open}
        onValueChange={() => setOpen((prev) => !prev)}
        color={colors.primary}
        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
      />
    </View>
  );
};

export default NotificationItem;
