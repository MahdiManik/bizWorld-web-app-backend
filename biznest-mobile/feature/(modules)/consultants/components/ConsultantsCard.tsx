import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Button from '@/components/ui/button';

interface ConsultantsCardProps {
  name: string;
  category: string;
  project: string;
  budget: string;
  timeline: string;
  timeAgo: string;
  onAccept: () => void;
  onReject: () => void;
}

const ConsultantsCard = ({
  name,
  category,
  project,
  budget,
  timeline,
  timeAgo,
  onAccept,
  onReject,
}: ConsultantsCardProps) => {
  return (
    <TouchableOpacity
      className="flex flex-row gap-2 rounded-lg border border-stroke-border bg-gray-white p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Image
        source={require('@/assets/images/consultants.png')}
        alt="consultants"
        className="relative h-11 w-11 rounded-full object-cover"
        resizeMode="cover"
      />
      <View className="flex-1">
        <View className="flex-row justify-between">
          <View>
            <Text className="font-roboto500 text-base text-subtle">{name}</Text>
            <Text className="font-roboto400 text-sm text-description-text">
              {category}
            </Text>
          </View>
          <Text className="font-roboto400 text-sm text-placeholder">
            {timeAgo}
          </Text>
        </View>
        <View className="mt-4 space-y-2">
          <View className="flex-row">
            <Text className="w-24 font-roboto400 text-sm text-description-text">
              Project
            </Text>
            <Text className="flex-1 font-roboto500 text-sm text-title">
              : {project}
            </Text>
          </View>
          <View className="flex-row">
            <Text className="w-24 font-roboto400 text-sm text-description-text">
              Budget
            </Text>
            <Text className="flex-1 font-roboto500 text-sm text-title">
              : {budget}
            </Text>
          </View>
          <View className="flex-row">
            <Text className="w-24 font-roboto400 text-sm text-description-text">
              Timeline
            </Text>
            <Text className="flex-1 font-roboto500 text-sm text-title">
              : {timeline}
            </Text>
          </View>
        </View>
        <View className="mt-4 flex-row gap-2">
          <Button
            title="Reject"
            onPress={onReject}
            className="flex-1 justify-center border-red"
            titleClassName="text-red"
            variant="danger"
          />
          <Button
            title="Accept"
            onPress={onAccept}
            className="flex-1 justify-center"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConsultantsCard;
