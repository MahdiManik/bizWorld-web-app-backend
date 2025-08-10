import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Button from '@/components/ui/button';
import { ConsultantLink } from '../types/consultant';
import { formatRelativeTime } from '@/utils/date';
import { useUpdateConsultRequest } from '../hooks/useConsultant';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';

interface ConsultantsCardProps {
  requestData: ConsultantLink;
}

const ConsultantRequestCard = ({ requestData }: ConsultantsCardProps) => {
const { mutateAsync } = useUpdateConsultRequest();

  // 🌟 Calculate simulated rating based on profile completeness
  const calculateRating = () => {
    const profile = requestData?.request_user?.user_profile;
    let rating = 3.0; // Base rating

    if (profile?.professionalHeadline) rating += 0.3;
    if (profile?.industrySpecialization) rating += 0.3;
    if (profile?.introduction) rating += 0.3;
    if (profile?.portfolioLink) rating += 0.3;
    if (profile?.image?.url) rating += 0.3;
    if (profile?.areasOfExpertise) rating += 0.2;
    if (profile?.yearsOfExperience) rating += 0.3;

    return Math.min(5.0, Math.round(rating * 10) / 10); // Cap at 5.0 and round to 1 decimal
  };

  const rating = calculateRating();

  // 🌟 Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={14} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFD700" />
      );
    }

    return stars;
  };
  const handleReject = async () => {
    await mutateAsync({
      id: requestData?.documentId?.toString(),
      updateData: {
        actionDate: dayjs().format('YYYY-MM-DD'),
        consultantStatus: 'Rejected',
      },
    });
  };
  const handleAccept = async () => {
    await mutateAsync({
      id: requestData?.documentId?.toString(),
      updateData: {
        actionDate: dayjs().format('YYYY-MM-DD'),
        consultantStatus: 'Approved',
      },
    });
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
        source={{ uri: requestData?.request_user?.user_profile?.image?.url }}
        alt="consultants"
        className="relative h-11 w-11 rounded-full object-cover"
        resizeMode="cover"
      />
      <View className="flex-1">
        <View className="flex-row justify-between">
          <View>
            <Text className="font-roboto500 text-base text-subtle">
              {requestData?.request_user?.fullName}
            </Text>
            <Text className="font-roboto400 text-sm text-description-text">
              {requestData?.request_user?.user_profile?.professionalHeadline}
            </Text>
            {/* 🌟 Rating Display */}
            <View className="mt-1 flex-row items-center gap-1">
              <View className="flex-row">
                {renderStars(rating)}
              </View>
              <Text className="font-roboto500 text-xs text-description-text">
                ({rating})
              </Text>
            </View>
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
            <Text className="flex-1 font-roboto500 text-sm text-primary">
              : {requestData?.budget || 'Not specified'}
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
        <View className="mt-4 flex-row gap-2">
          <Button
            title="Reject"
            onPress={handleReject}
            className="flex-1 justify-center border-red"
            titleClassName="text-red"
            variant="danger"
          />
          <Button
            title="Accept"
            onPress={handleAccept}
            className="flex-1 justify-center"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConsultantRequestCard;
