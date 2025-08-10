import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useRef, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import SuggestionsCard from './SuggestionCard';
import { router } from 'expo-router';
import { useGetConsultantsList } from '../hooks/useConsultant';
import SendRequestCard from './SendRequestCard';
import { ConsultantLink } from '../types/consultant';

const mockSuggestions = [
  {
    id: '1',
    name: 'Jane Smith',
    category: 'Business Valuation',
    location: 'New York, USA',
    rating: 4.9,
    reviewCount: 28,
    hourlyRate: 150,
    isAvailable: true,
    description:
      'MBA with 15+ years experience in business valuation and M&A. Specialized in tech startups.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    category: 'Tax Advisory',
    location: 'California, USA',
    rating: 4.8,
    reviewCount: 35,
    hourlyRate: 120,
    isAvailable: true,
    description:
      'CPA with expertise in corporate tax planning and compliance. Helps businesses optimize tax strategies.',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    category: 'Legal Consulting',
    location: 'Texas, USA',
    rating: 4.7,
    reviewCount: 42,
    hourlyRate: 180,
    isAvailable: false,
    description:
      'Corporate lawyer specializing in business law, contracts, and regulatory compliance.',
  },
  {
    id: '4',
    name: 'David Rodriguez',
    category: 'Financial Planning',
    location: 'Florida, USA',
    rating: 4.6,
    reviewCount: 19,
    hourlyRate: 100,
    isAvailable: true,
    description:
      'Certified Financial Planner with focus on small business financial management and growth strategies.',
  },
  {
    id: '5',
    name: 'Emily Thompson',
    category: 'Marketing Strategy',
    location: 'Washington, USA',
    rating: 4.9,
    reviewCount: 51,
    hourlyRate: 130,
    isAvailable: true,
    description:
      'Digital marketing expert with proven track record in brand development and customer acquisition.',
  },
];

const SendRequests = () => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading 
  } = useGetConsultantsList({ 
    type: 'send-request', 
    page_size: 10 
  });

  const sendRequests = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const renderSuggestionCard = ({ item }: { item: ConsultantLink }) => (
    <SendRequestCard requestData={item} />
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
          showBackButton
          title="Send Requests"
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 p-4">
          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              Sent requests
            </Text>
          </View>
          <FlatList
            data={sendRequests}
            renderItem={renderSuggestionCard}
            keyExtractor={(item) => item.documentId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshing={isLoading}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default SendRequests;
