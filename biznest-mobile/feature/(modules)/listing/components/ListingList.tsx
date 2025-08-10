import { View, FlatList } from 'react-native';
import React from 'react';
import Listing from '@/components/shared/listing';

import FloatingActionButton from '@/components/ui/floating-action-button';
import { router } from 'expo-router';
import { Listing as ListingType, ListingResponse } from '../types/listing';
import ListingItem from './ListingItem';

interface ListingListProps {
  listingData?: ListingResponse;
}

const ListingList = ({ listingData }: ListingListProps) => {
  const renderListingItem = ({ item }: { item: ListingType }) => (
    <ListingItem listing={item} type="browse" />
  );

  return (
    <View className="flex-1">
      <FlatList
        data={listingData?.data}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.documentId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 100,
        }}
      />

      {/* Floating Action Button - only show for listing type */}

      <FloatingActionButton
        onPress={() => router.push('/add-listing')}
        icon="add"
        size="large"
        iconSize={28}
        variant="primary"
        bottom={60}
        right={10}
      />
    </View>
  );
};

export default ListingList;
