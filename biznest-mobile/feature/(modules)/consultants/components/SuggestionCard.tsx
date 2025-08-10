import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Button from '@/components/ui/button';
import { AntDesign } from '@expo/vector-icons';
import { SuggestConsultant } from '../types/consultant';
import { router } from 'expo-router';

interface SuggestionsCardProps {
  suggestedData: SuggestConsultant;
}

const SuggestionsCard = ({ suggestedData }: SuggestionsCardProps) => {
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
        source={{ uri: suggestedData?.user_profile?.image?.url }}
        alt="consultants"
        className="relative h-11 w-11 rounded-full object-cover"
        resizeMode="cover"
      />
      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="font-roboto500 text-base text-subtle">
              {suggestedData?.fullName}
            </Text>
            <Text className="font-roboto400 text-xs text-description-text">
              {suggestedData?.user_profile?.professionalHeadline}
            </Text>
            <Text className="font-roboto400 text-xs">
              {suggestedData?.user_profile?.location}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <AntDesign name="star" size={16} color="#E4A70A" />
            <Text className="font-roboto500 text-sm text-subtle">{5}</Text>
            <Text className="font-roboto500 text-[10px] text-placeholder">
              ({1})
            </Text>
          </View>
        </View>
        <View className="my-2 flex-row items-center justify-between">
          <Text className="font-roboto500 text-sm text-black">
            ${150} <Text className="text-placeholder">/ hour</Text>
          </Text>
          <View className={`rounded-full bg-[#DCFCE7] px-2 py-1`}>
            <Text className={`font-roboto400 text-[10px] text-[#016730]`}>
              {'Available'}
            </Text>
          </View>
        </View>
        <Text className="font-roboto400 text-xs text-black">
          {suggestedData?.user_profile?.introduction}
        </Text>

        <Button
          title={'Select & Request'}
          onPress={() =>
            router.push({
              pathname: '/consultants/edit-profile-info',
              params: {
                consultant: suggestedData?.documentId,
                consultantName: suggestedData?.fullName,
              },
            })
          }
          variant={'outline'}
          className="my-2"
        />
      </View>
    </TouchableOpacity>
  );
};

export default SuggestionsCard;
