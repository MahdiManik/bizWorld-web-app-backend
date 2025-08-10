import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import Button from '../ui/button';
import { router } from 'expo-router';

interface ListingProps {
  listing: any;

  type: 'listing' | 'my-listing' | 'my-interest';
}
const Listing = ({ listing, type }: ListingProps) => {
  return (
    <TouchableOpacity
      className="relative mb-4 w-full overflow-hidden rounded-xl border border-gray-200 bg-white"
      onPress={() => router.push('/listing-detail')}
    >
      <View>
        <Image
          source={require('@/assets/images/listing.png')}
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
            onPress={() => router.push('/edit-listing')}
          >
            <Feather name="edit-3" size={18} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-[#FFFFFF7D] p-2.5"
            onPress={() => {}}
          >
            <AntDesign name="hearto" size={14} color="black" />
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
          ) : type === 'listing' ? (
            <View className="flex-row gap-2">
              <Entypo name="location-pin" size={14} color={colors.primary} />
              <Text className="text-sm font-medium" numberOfLines={2}>
                {'United States'}
              </Text>
            </View>
          ) : type === 'my-interest' ? (
            <View className="gap-3">
              <Text className="text-sm font-medium" numberOfLines={2}>
                {listing?.category || 'Small Business'}
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={'h-1.5 w-1.5 rounded-full bg-status-pending'}
                />
                <Text className={'font-roboto600 text-xs text-status-pending'}>
                  Pending
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Button
                  title="View Business"
                  variant="outline"
                  onPress={() => {}}
                  className="flex-1 justify-center"
                />
                <Button
                  title="Message Owner"
                  onPress={() => {}}
                  className="flex-1 justify-center"
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Listing;
