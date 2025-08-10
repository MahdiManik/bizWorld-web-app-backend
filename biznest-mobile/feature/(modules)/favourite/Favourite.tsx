import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { FlatList, TouchableOpacity, View } from 'react-native';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { useGetFavouriteListing } from '../listing/hooks/useListing';
import { Listing } from '../listing/types/listing';
import ListingItem from '../listing/components/ListingItem';
import NoListingData from '../listing/components/NoListingData';
import { useDebounce } from '@/hooks/useDebounce';

const Favourite = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetFavouriteListing({
      search: debouncedSearch,
      page_size: 10,
    });

  const favouriteListings = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const renderListingItem = ({ item }: { item: Listing }) => (
    <ListingItem listing={item} type="browse" />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header
          title="My Favourites"
          showBackButton
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <View className="mx-5 my-4 flex-1">
          <Input
            leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
            className="border-0 bg-lightgray"
            placeholder="Search .."
            value={search}
            onChangeText={setSearch}
            rightIcon={
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="filter" size={20} color="#8E8E93" />
              </TouchableOpacity>
            }
          />
          <View className="flex-1">
            <FlatList
              data={favouriteListings}
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
              ListEmptyComponent={() =>
                !isLoading ? <NoListingData isFavourite /> : null
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Favourite;
