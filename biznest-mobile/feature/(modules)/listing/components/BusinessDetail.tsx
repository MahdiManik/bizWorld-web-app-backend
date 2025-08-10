import { View, Text } from 'react-native';
import React from 'react';

interface BusinessDetailProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}
const BusinessDetail = ({ title, value, icon }: BusinessDetailProps) => {
  return (
    <View className="flex-row">
      <View className="flex-1 flex-row items-center gap-3">
        {icon}
        <Text className="font-roboto400 text-sm text-description-text">
          {title}
        </Text>
      </View>
      <Text className="flex-1 font-roboto600 text-sm text-title">{value}</Text>
    </View>
  );
};

export default BusinessDetail;
