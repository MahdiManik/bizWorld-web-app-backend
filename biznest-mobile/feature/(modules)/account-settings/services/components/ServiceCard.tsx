import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Entypo, Feather } from '@expo/vector-icons';
import { Service } from '../types/service';
import { router } from 'expo-router';

interface ServiceCardProps {
  serviceData: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ serviceData }) => {
  return (
    <TouchableOpacity
      className="mb-4 rounded-lg border border-stroke-border bg-white p-4"
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 1, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
      }}
      onPress={() => {}}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="mb-2 font-roboto500 text-sm text-title">
            {serviceData?.title}
          </Text>
          <Text className="mb-3 font-roboto500 text-sm text-link">
            {serviceData?.hourlyRate} / hour
          </Text>
          <Text className="font-roboto300 text-xs text-description-text">
            {serviceData?.description}
          </Text>
        </View>
        <TouchableOpacity
          className="flex items-center justify-center rounded-full bg-[#FFFFFF7D] p-2.5"
          onPress={() => router.push('/account-settings/services/edit-service')}
        >
          <Feather name="edit-3" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCard;
