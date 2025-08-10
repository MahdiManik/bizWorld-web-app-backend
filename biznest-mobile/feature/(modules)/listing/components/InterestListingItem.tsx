import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { InterestListing } from '../types/interest-listing';
import Button from '@/components/ui/button';
import { useLikeandUnlikeListing } from '../hooks/useListing';
import colors from '@/constants/colors';
import useSession from '@/store/session';

interface InterestListingItemProps {
  interestListing?: InterestListing;
}
const InterestListingItem = ({ interestListing }: InterestListingItemProps) => {
  const { user } = useSession();
  const documentId = user?.documentId || user?.id || '';

  const isFavourite = interestListing?.listing?.likedUser.some(
    (like) => like.documentId == documentId
  );
  const { mutateAsync } = useLikeandUnlikeListing();
  const handleLike = async () => {
    let likedUsers =
      interestListing?.listing?.likedUser?.map((like) => like.documentId) || [];
    if (isFavourite) {
      likedUsers = likedUsers.filter((like) => like !== documentId);
    } else {
      likedUsers.push(documentId);
    }

    await mutateAsync({
      id: interestListing?.listing?.documentId || '',
      likedUser: likedUsers,
    });
  };
  return (
    <TouchableOpacity
      className="relative mb-4 w-full overflow-hidden rounded-xl border border-gray-200 bg-white"
      onPress={() =>
        router.push({
          pathname: '/listing-detail',
          params: {
            documentId: interestListing?.listing?.documentId,
          },
        })
      }
    >
      <View>
        <Image
          source={{ uri: interestListing?.listing?.image?.url }}
          alt="listing"
          className="relative h-36 w-full object-cover"
          resizeMode="cover"
        />
        <View className="absolute left-0 top-0 rounded-br-xl rounded-tr-none bg-primary px-3 py-1.5">
          <Text className="text-xs font-medium text-white">
            {interestListing?.listing?.category || 'ECOMMERCE'}
          </Text>
        </View>

        <TouchableOpacity
          className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-[#FFFFFF7D] p-2.5"
          onPress={() => handleLike()}
        >
          {isFavourite ? (
            <AntDesign name="heart" size={14} color={colors.red} />
          ) : (
            <AntDesign name="hearto" size={14} color="black" />
          )}
        </TouchableOpacity>

        <View className="p-4">
          <Text className="mb-1 text-base font-semibold" numberOfLines={2}>
            {interestListing?.listing?.title ||
              'Shopify store selling Shilajit in a unique ready-to-drink shots package.'}
          </Text>

          <Text className="py-1 text-base text-link" numberOfLines={2}>
            Asking Price - {interestListing?.listing?.askingPrice || '$0'}
          </Text>
          <View className="gap-3">
            <Text className="text-sm font-medium" numberOfLines={2}>
              {interestListing?.listing?.category || 'Small Business'}
            </Text>
            <View className="flex-row items-center gap-2">
              <View className={'h-1.5 w-1.5 rounded-full bg-status-pending'} />
              <Text className={'font-roboto600 text-xs text-status-pending'}>
                Pending
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Button
                title="View Business"
                variant="outline"
                onPress={() => {
                  router.push('/(auth)/user-onboarding');
                }}
                className="flex-1 justify-center"
              />
              <Button
                title="Message Owner"
                onPress={() => {}}
                className="flex-1 justify-center"
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InterestListingItem;
