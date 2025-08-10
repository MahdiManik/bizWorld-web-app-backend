import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';

import { router } from 'expo-router';
import { Listing as ListingType } from '@/feature/(modules)/listing/types/listing';
import { useLikeandUnlikeListing } from '../hooks/useListing';
import useSession from '@/store/session';

interface ListingItemProps {
  listing: ListingType;
  type: 'browse' | 'my-listing';
}
const ListingItem = ({ listing, type }: ListingItemProps) => {
  const { user } = useSession();
  const documentId = user?.documentId?.toString() || user?.id.toString() || '';
  const isFavourite = listing?.likedUser.some(
    (like) => like.documentId == documentId
  );
  const { mutateAsync } = useLikeandUnlikeListing();
  const handleLike = async () => {
    let likedUsers = listing?.likedUser?.map((like) => like.documentId) || [];
    if (isFavourite) {
      likedUsers = likedUsers.filter((like) => like !== documentId);
    } else {
      likedUsers.push(documentId);
    }

    await mutateAsync({ id: listing?.documentId, likedUser: likedUsers });
  };
  return (
    <TouchableOpacity
      className="relative mb-4 w-full overflow-hidden rounded-xl border border-gray-200 bg-white"
      onPress={() =>
        router.push({
          pathname: '/listing-detail',
          params: {
            documentId: listing?.documentId,
            isMylisting: type == 'my-listing' ? 'true' : 'false',
          },
        })
      }
    >
      <View>
        <Image
          source={{ uri: listing?.image?.url }}
          alt="listing"
          className="relative h-36 w-full object-cover"
          resizeMode="cover"
        />
        <View className="absolute left-0 top-0 rounded-br-xl rounded-tr-none bg-primary px-3 py-1.5">
          <Text className="text-xs font-medium text-white">
            {listing?.category || 'ECOMMERCE'}
          </Text>
        </View>
        {type === 'my-listing' ? (
          <TouchableOpacity
            className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-[#FFFFFF7D] p-2.5"
            onPress={() =>
              router.push({
                pathname: '/edit-listing',
                params: {
                  documentId: listing?.documentId,
                },
              })
            }
          >
            <Feather name="edit-3" size={18} color="black" />
          </TouchableOpacity>
        ) : (
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
        )}
        <View className="p-4">
          <Text className="mb-1 text-base font-semibold" numberOfLines={2}>
            {listing?.title ||
              'Shopify store selling Shilajit in a unique ready-to-drink shots package.'}
          </Text>

          <Text className="py-1 text-base text-link" numberOfLines={2}>
            Asking Price - {listing?.askingPrice || '$0'}
          </Text>
          {type === 'my-listing' ? (
            <Text className="text-sm font-medium" numberOfLines={2}>
              {listing?.category || 'Small Business'}
            </Text>
          ) : type === 'browse' ? (
            <View className="flex-row gap-2">
              <Entypo name="location-pin" size={14} color={colors.primary} />
              <Text className="text-sm font-medium" numberOfLines={2}>
                {listing.country}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListingItem;
