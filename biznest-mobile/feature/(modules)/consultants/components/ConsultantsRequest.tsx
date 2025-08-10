import Header from '@/components/ui/header';
import { Text } from '@/components/ui/text';
import { TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { useGetConsultantsList } from '../hooks/useConsultant';
import { ConsultantLink } from '../types/consultant';
import ConsultantRequestCard from './ConsultantRequestCard';
import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ConsultantFilterModal, { FilterFormData } from './ConsultantFilterModal';

export default function ConsultantsRequest() {
  const { data } = useGetConsultantsList({ type: 'request' });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300); // Faster debounce
  const [filterData, setFilterData] = useState<Partial<FilterFormData>>({});
  const listingFilterModalRef = useRef<BottomSheetModal>(null);

  // � Optimized consultant names - only compute when data changes
  const consultantNames = useMemo(() => {
    const rawData = data?.pages?.[0]?.data;
    if (!rawData) return [];

    const names = new Set<string>();
    rawData.forEach((item: ConsultantLink) => {
      const name = item.request_user?.fullName;
      if (name) names.add(name);
    });

    return Array.from(names).map(name => ({
      label: name,
      value: name.toLowerCase().replace(/\s+/g, '_')
    }));
  }, [data]);

  // � Static rating options - no need to recreate
  const ratingOptions = useMemo(() => [
    { label: '5 Stars', value: '5' },
    { label: '4+ Stars', value: '4' },
    { label: '3+ Stars', value: '3' },
    { label: '2+ Stars', value: '2' },
    { label: '1+ Stars', value: '1' },
  ], []);

  const renderConsultantCard = useCallback(({ item }: { item: ConsultantLink }) => (
    <ConsultantRequestCard requestData={item} />
  ), []);

  const handleFilterApply = (filters: FilterFormData) => {
    setFilterData(filters);
    listingFilterModalRef?.current?.dismiss();
  };

  // 🚀 Simplified and optimized filtering
  const filteredConsultants = useMemo(() => {
    const rawData = data?.pages?.[0]?.data;
    if (!rawData) return [];

    // If no search or filters, return all data
    if (!debouncedSearch && Object.keys(filterData).length === 0) {
      return rawData;
    }

    return rawData.filter((consultant: ConsultantLink) => {
      // 🔍 Simple search - only if there's a search query
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const name = consultant.request_user?.fullName?.toLowerCase() || '';
        const project = consultant.projectScope?.toLowerCase() || '';
        const budget = consultant.budget?.toLowerCase() || '';

        if (!name.includes(searchLower) && !project.includes(searchLower) && !budget.includes(searchLower)) {
          return false;
        }
      }

      // 🏭 Industry filter - only if selected
      if (filterData.industries?.length) {
        const userIndustry = consultant.request_user?.user_profile?.industrySpecialization?.toLowerCase() || '';
        if (!filterData.industries.some(ind => userIndustry.includes(ind.toLowerCase()))) {
          return false;
        }
      }

      // 👤 Consultant name filter - only if selected
      if (filterData.consultantName) {
        const name = consultant.request_user?.fullName?.toLowerCase() || '';
        if (!name.includes(filterData.consultantName.toLowerCase())) {
          return false;
        }
      }

      // 💰 Simple price filter - only if set
      if (filterData.priceMin || filterData.priceMax) {
        const budgetStr = consultant.budget || '';
        const numbers = budgetStr.match(/\d+/g);
        if (numbers) {
          const budgetValue = parseInt(numbers[0]);
          const min = filterData.priceMin ? parseInt(filterData.priceMin.replace(/\D/g, '')) : 0;
          const max = filterData.priceMax ? parseInt(filterData.priceMax.replace(/\D/g, '')) : 999999;
          if (budgetValue < min || budgetValue > max) {
            return false;
          }
        }
      }

      // ⭐ Simple rating filter - only if selected
      if (filterData.rating) {
        const profile = consultant.request_user?.user_profile;
        let rating = 3;
        if (profile?.professionalHeadline) rating += 0.4;
        if (profile?.industrySpecialization) rating += 0.4;
        if (profile?.image?.url) rating += 0.4;
        if (profile?.introduction) rating += 0.4;
        if (profile?.portfolioLink) rating += 0.4;

        if (rating < parseInt(filterData.rating)) {
          return false;
        }
      }

      return true;
    });
  }, [data, debouncedSearch, filterData]); // Use debouncedSearch instead of searchQuery



  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header showBackButton title="Consultants Request" />
        <View className="flex-1 p-4">
          <Input
            leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
            className="border-0 bg-lightgray"
            placeholder="Search consultants, projects, budget..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            rightIcon={
              <TouchableOpacity onPress={() => listingFilterModalRef?.current?.present()}>
                <Ionicons name="filter" size={20} color="#8E8E93" />
              </TouchableOpacity>
            }
          />

          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              Consultant requests
            </Text>
          </View>
          <FlatList
            data={filteredConsultants}
            renderItem={renderConsultantCard}
            keyExtractor={(item) => item.documentId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
            getItemLayout={undefined}
          />
        </View>
        <ConsultantFilterModal
          ref={listingFilterModalRef}
          onApply={handleFilterApply}
          onCancel={() => listingFilterModalRef?.current?.dismiss()}
          snapPoints={['55%', '90%']}
          index={2}
          consultantName={consultantNames}
          ratingOptions={ratingOptions}
          onChange={(_index) => {}}
        />
      </SafeAreaView>
    </>
  );
}
