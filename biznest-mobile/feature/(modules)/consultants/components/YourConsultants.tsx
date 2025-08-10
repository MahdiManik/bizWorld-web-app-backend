import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import Button from '@/components/ui/button';
import { useGetConsultantsList } from '../hooks/useConsultant';
import YourConsultantCard from './YourConsultantCard';
import { router } from 'expo-router';

const YourConsultants = () => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading 
  } = useGetConsultantsList({ 
    type: 'your-consultants', 
    page_size: 10 
  });

  const consultants = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const handleSeeConsultantSuggestions = () => {
    router.push('/(module)/(a-root)/consultants/suggestions');
  };

  const renderSuggestionCard = ({ item }: { item: any }) => (
    <YourConsultantCard consultantData={item} />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <Image
        source={require('@/assets/images/no-consultants.png')}
        className="mb-8"
        style={{ width: 280, height: 200 }}
        resizeMode="contain"
      />
      <Text className="text-dark mb-4 text-center font-roboto700 text-2xl">
        No consultants yet
      </Text>
      <Text className="mb-12 text-center font-roboto400 text-base leading-6 text-subtle">
        When you have consultants,{'\n'}they'll appear here.
      </Text>
      <Button
        title="See Consultant Suggestions"
        onPress={handleSeeConsultantSuggestions}
        variant="primary"
        size="large"
        fullWidth
      />
    </View>
  );

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header
          showBackButton
          title="Your consultants"
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 p-4">
          <Input
            leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
            className="border-0 bg-lightgray"
            placeholder="Search .."
            rightIcon={
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="filter" size={20} color="#8E8E93" />
              </TouchableOpacity>
            }
          />
          {consultants && consultants?.length > 0 && (
            <View className="my-3 flex-row items-center justify-between">
              <Text className="font-roboto500 text-base text-subtle">
                {data?.pages?.[0]?.meta?.pagination?.total} Consultants
              </Text>
            </View>
          )}

          {consultants && consultants?.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={consultants}
              renderItem={renderSuggestionCard}
              keyExtractor={(item) => item.documentId}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ItemSeparatorComponent={() => <View className="h-3" />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshing={isLoading}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default YourConsultants;
