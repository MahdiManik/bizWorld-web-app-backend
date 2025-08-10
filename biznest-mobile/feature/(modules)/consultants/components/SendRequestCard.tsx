import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Button from '@/components/ui/button';
import { ConsultantLink } from '../types/consultant';
import { formatRelativeTime } from '@/utils/date';
import { useDeleteConsultRequest } from '../hooks/useConsultant';

interface ConsultantsCardProps {
  requestData: ConsultantLink;
}

const SendRequestCard = ({ requestData }: ConsultantsCardProps) => {
  const { mutateAsync } = useDeleteConsultRequest();
  const handleCancel = async () => {
    await mutateAsync({ id: requestData?.documentId });
  };
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
        source={{ uri: requestData?.consultant?.user_profile?.image?.url }}
        alt="consultants"
        className="relative h-11 w-11 rounded-full object-cover"
        resizeMode="cover"
      />
      <View className="flex-1">
        <View className="flex-row justify-between">
          <View>
            <Text className="font-roboto500 text-base text-subtle">
              {requestData?.consultant?.fullName}
            </Text>
            <Text className="font-roboto400 text-sm text-description-text">
              {requestData?.consultant?.user_profile?.professionalHeadline}
            </Text>
          </View>
          <Text className="font-roboto400 text-sm text-placeholder">
            {formatRelativeTime(requestData?.createdAt)}
          </Text>
        </View>
        <View className="mt-4 space-y-2">
          <View className="flex-row">
            <Text className="w-24 font-roboto400 text-sm text-description-text">
              Project
            </Text>
            <Text className="flex-1 font-roboto500 text-sm text-title">
              : {requestData?.projectScope}
            </Text>
          </View>
          <View className="flex-row">
            <Text className="w-24 font-roboto400 text-sm text-description-text">
              Budget
            </Text>
            <Text className="flex-1 font-roboto500 text-sm text-title">
              : {requestData?.budget}
            </Text>
          </View>
          <View className="flex-row">
            <Text className="w-24 font-roboto400 text-sm text-description-text">
              Timeline
            </Text>
            <Text className="flex-1 font-roboto500 text-sm text-title">
              : {requestData?.timeline}
            </Text>
          </View>
        </View>
        <Button
          title={'Cancel'}
          onPress={handleCancel}
          variant={'outline'}
          className="my-2"
          fullWidth
        />
      </View>
    </TouchableOpacity>
  );
};

export default SendRequestCard;
