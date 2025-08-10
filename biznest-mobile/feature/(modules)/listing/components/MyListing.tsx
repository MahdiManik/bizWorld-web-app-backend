import { View, TouchableOpacity, FlatList } from 'react-native';
import React, { useRef, useState, useMemo } from 'react';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import ChipTabBar, { TabItem } from '@/components/ui/chip-tab-bar';
import { useGetListing } from '../hooks/useListing';
import { Listing } from '../types/listing';
import ListingItem from './ListingItem';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { router } from 'expo-router';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ListingFilterModal, {
  FilterFormData,
} from '@/components/shared/listing-filter-modal';
import NoListingData from './NoListingData';
import { useDebounce } from '@/hooks/useDebounce';

const MyListing = () => {
  const listingFilterModalRef = useRef<BottomSheetModal>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const tabs: TabItem[] = [
    { id: 'all', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'REJECTED', label: 'Declined' },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetListing({
      type: 'my-listing',
      tab: 'all',
      search: debouncedSearch,
      page_size: 2,
      listingStatus: activeTab,
    });

  const listings = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const renderListingItem = ({ item }: { item: Listing }) => (
    <ListingItem listing={item} type="my-listing" />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleFilterApply = (filters: FilterFormData) => {
    console.log('Applied filters:', filters);
    // Add your filter logic here
    listingFilterModalRef?.current?.dismiss();
  };
  return (
    <View className="mx-5 my-4 flex-1">
      <Input
        leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
        className="border-0 bg-lightgray"
        placeholder="Search .."
        value={search}
        onChangeText={setSearch}
      />

      <View className="mt-4">
        <ChipTabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>
      <View className="flex-1">
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.documentId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          ListEmptyComponent={() => (!isLoading ? <NoListingData /> : null)}
        />

        <FloatingActionButton
          onPress={() => router.push('/add-listing')}
          icon="add"
          size="large"
          iconSize={28}
          variant="primary"
          bottom={60}
          right={10}
        />
        <ListingFilterModal
          ref={listingFilterModalRef}
          onApply={handleFilterApply}
          onCancel={() => listingFilterModalRef?.current?.dismiss()}
          snapPoints={['55%', '90%']}
          index={2}
          onChange={(index) => {}}
        />
      </View>
    </View>
  );
};

export default MyListing;
