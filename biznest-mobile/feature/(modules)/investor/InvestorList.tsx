import { View } from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/button';
import InvestorFlatList from './InvestorFlatList';
import { useInvestorUsers } from './hooks/useInvestor';
import { useUserId } from '@/feature/(auth)/hooks/useAuth';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useDebounce } from '@/hooks/useDebounce';
import InvestorFilterModal, { FilterFormData } from './InvesterFilterModal';

interface InvestorListProps {
  filterStatus?: string;
  isPremiumUser?: boolean;
}

const InvestorList = ({
  filterStatus = 'all',
  isPremiumUser = false,
}: InvestorListProps) => {
  const userId = useUserId();
  const { data } = useInvestorUsers({ userId: Number(userId) });
  const investorData = data?.pages.flatMap((page) => page.data);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [filterData, setFilterData] = useState<Partial<FilterFormData>>({});
  const listingFilterModalRef = useRef<BottomSheetModal>(null);

  const businessNameOptions = useMemo(() => {
    if (!investorData) return [];
    const names = new Set<string>();
    investorData[0]?.data.forEach((investor: any) => {
      if (investor.interestedUsers?.company?.name) {
        names.add(investor.interestedUsers.company.name);
      }
    });
    return Array.from(names).map((name) => ({ label: name, value: name }));
  }, [investorData]);

  const handleFilterApply = (filters: FilterFormData) => {
    console.log('Applied filters:', filters);
    setFilterData(filters); // <-- save filters in state
    listingFilterModalRef?.current?.dismiss();
  };

  return (
    <View className="flex-1">
      <View className="mx-5 my-4 flex-1">
        <Input
          leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
          className="border-0 bg-lightgray"
          placeholder="Search with name, location, or listing"
          value={searchQuery}
          onChangeText={setSearchQuery}
          rightIcon={
            <Button
              onPress={() => listingFilterModalRef?.current?.present()}
              title=""
              icon={<Ionicons name="filter" size={20} color="#8E8E93" />}
              variant="text"
            />
          }
        />

        <View className="mt-4 flex-1">
          <InvestorFlatList
            interestedUsers={investorData}
            filterStatus={filterStatus}
            searchQuery={debouncedSearch}
            isPremiumUser={isPremiumUser}
            filters={filterData}
          />
        </View>
        <InvestorFilterModal
          ref={listingFilterModalRef}
          onApply={handleFilterApply}
          onCancel={() => listingFilterModalRef?.current?.dismiss()}
          snapPoints={['55%', '90%']}
          index={2}
          businessNameOptions={businessNameOptions}
          onChange={(index) => {}}
        />
      </View>
    </View>
  );
};

export default InvestorList;
