import { View } from 'react-native';
import React from 'react';
import Button from '@/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/string';
import { Text } from '@/components/ui/text';
import { getStatusStyles } from '@/utils/status';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { useUpdateInterestStatus } from './hooks/useInvestor';
import { router } from 'expo-router';
import { useUserId } from '@/feature/(auth)/hooks/useAuth';
import { Image } from 'expo-image';
import dayjs from 'dayjs';

interface InvestorCardProps {
  investor: {
    id: string;
    name: string;
    image?: { url: string; }
    updatedAt: string;
    location: string;
    interests: string;
    listingTitle: string;
    status: string;
    remark: string;
    isPremium?: boolean;
  };
  isPremiumUser?: boolean;
}

const InvestorCard = ({
  investor,
  isPremiumUser = false,
}: InvestorCardProps) => {
  const userId = useUserId();
  const { mutate: updateInterestStatus } = useUpdateInterestStatus(Number(userId));
  const connectedDate =
  investor?.updatedAt
      ? dayjs(investor.updatedAt).format('DD MMMM, YYYY')
      : null;
  const handleMessagePress = () => {
    if (!isPremiumUser && investor.status.toLowerCase() === 'approved') {
      router.push('/(modal)/upgrade-to-premium');
    } else {
      console.log('Message sent to investor:', investor.name);
    }
  };

  const handleAcceptPress = () => {
    updateInterestStatus({ id: investor?.id, status: 'Approved', remark: '' });
  };

  const handleReject = () => {
    router.push({
      pathname: '/(modal)/invester-reject',
      params: { id: investor.id },
    });
  };

  const statusStyles = getStatusStyles(investor.status);

  return (
    <View className="mb-4 rounded-lg border border-gray-100 bg-gray-white p-5 shadow-md shadow-gray-200">
      <View className="mb-2 flex-row items-start justify-center">
        <View className="flex-1 flex-row items-start">
          <View className="mr-3 h-14 w-14 items-center justify-center rounded-full bg-gray-800">
            <Image
              source={
                investor?.image?.url
                  ? { uri: investor?.image?.url }
                  : require('@/assets/images/consultants.png')
              }
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
              contentFit="cover"
            />

          </View>
          <View>
            <View className="flex-row items-center">
              <Text className="text-sm font-semibold text-title">
                {investor.name}
              </Text>
              {(isPremiumUser || investor.isPremium) && (
                <View className="ml-2 flex-row items-center">
                  <MaterialIcons name="star" size={16} color="#FFC107" />
                </View>
              )}
            </View>
            <Text className="mt-1 text-sm text-description-text">
              {investor.location}
            </Text>
            <View className="mt-3 flex-row flex-wrap">
              <View className="mb-1 mr-2 rounded-lg bg-badge px-2 py-1">
                <Text className="text-sm text-primary">{investor?.interests}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className={`${statusStyles.bgColor} rounded-full px-3 py-1`}>
          <Text className={`${statusStyles.textColor} text-xs font-medium`}>
            {capitalizeFirstLetter(investor.status)}
          </Text>
        </View>
      </View>

      <Text className="mb-4 mt-2 text-sm text-title">
        Interested in: <Text className="text-sm font-semibold">{investor.listingTitle}</Text>
      </Text>
      {investor.status === 'Approved' &&
        connectedDate && (
          <Text className="text-xs text-black mb-4">
            Connected: {connectedDate}
          </Text>
        )
      }

      {investor.status !== 'Rejected' ? (
        <View className="flex-row gap-2">
          <View className="flex-1">
            {investor.status.toLowerCase() === 'pending' ? (
              <Button title="Decline" onPress={handleReject} variant="danger" fullWidth />
            ) : (
              <Button title="View Profile" onPress={() => { router.push('/(module)/(a-root)/account-settings/personal-info') }} variant="danger" fullWidth />
            )}
          </View>
          <View className="flex-1">
            {investor.status.toLowerCase() === 'approved' ? (
              <Button
                title="Message"
                onPress={handleMessagePress}
                variant="secondary"
                fullWidth
                icon={<Octicons name="lock" size={16} color="black" />}
                iconPosition="left"
                className={!isPremiumUser ? 'bg-stroke-border' : 'bg-primary'}
                textClassName={!isPremiumUser ? 'text-white' : ' text-black'}
              />
            ) : (
              <Button title="Accept" onPress={handleAcceptPress} variant="primary" fullWidth />
            )}
          </View>
        </View>
      ) : (
        <View className="bg-secondary p-4 w-full">
          <Text className='text-title font-roboto600 text-sm'>Reason for Decline</Text>
          <Text className='text-xs pt-2 rounded-xl'>{investor?.remark}</Text>
        </View>

      )
      }
    </View>
  );
};

export default InvestorCard;
