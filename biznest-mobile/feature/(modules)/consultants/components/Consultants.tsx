import Button from '@/components/ui/button';
import Header from '@/components/ui/header';
import { Text } from '@/components/ui/text';
import { TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGetConsultantsList } from '../hooks/useConsultant';
import ConsultantRequestCard from './ConsultantRequestCard';
import { ConsultantLink } from '../types/consultant';
import { useMemo } from 'react';

export default function Consultants() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError
  } = useGetConsultantsList({
    type: 'request',
    page_size: 10
  });

  const consultantRequests = useMemo(() => {
    if (!data || !data.pages) {
      return [];
    }

    const requests = data.pages.flatMap(page => {
      return page?.data || [];
    });

    return requests;
  }, [data]);

  // const directData = data?.pages?.[0]?.data || [];

  const renderConsultantCard = ({ item, index }: { item: ConsultantLink; index: number }) => {
    if (!item) {
      return null;
    }

    return <ConsultantRequestCard requestData={consultantRequests [index]} />;
  };

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
        <Header showBackButton title="Consultants" />
        <View className="flex-1 p-4">
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex items-center justify-center rounded-full bg-lightgray px-4 py-2"
              onPress={() => router.push('/consultants/suggestions')}
              activeOpacity={0.7}
            >
              <Text className="font-roboto600 text-base leading-5 text-subtle">
                Suggestions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex items-center justify-center rounded-full bg-lightgray px-4 py-2"
              onPress={() => router.push('/consultants/your-consultants')}
              activeOpacity={0.7}
            >
              <Text className="font-roboto600 text-base leading-5 text-subtle">
                Your consultants
              </Text>
            </TouchableOpacity>
          </View>

          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              Consultant requests
            </Text>
            <Button
              title="View All"
              onPress={() => router.push('/consultants/consultants-request')}
              variant="text"
              size="none"
              titleClassName="text-base font-roboto600"
            />
          </View>

          {consultantRequests.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="font-roboto400 text-base text-description-text">
                {isLoading ? 'Loading consultant requests...' : 'No consultant requests found'}
              </Text>
              {isError && (
                <Text className="mt-2 font-roboto400 text-sm text-red-500">
                  Error: {error?.message || 'Failed to load data'}
                </Text>
              )}
            </View>
          ) : (
            <FlatList
              data={consultantRequests}
              renderItem={renderConsultantCard}
              keyExtractor={(item, index) => item?.documentId || `item-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ItemSeparatorComponent={() => <View className="h-3" />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshing={isLoading}
              ListEmptyComponent={() => (
                <View className="py-8">
                  <Text className="text-center font-roboto400 text-base text-description-text">
                    No consultant requests available
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
