import { FlatList } from 'react-native';
import React from 'react';
import InvestorCard from './InvestorCard';
import NoData from '@/components/ui/NoData';
import { FilterFormData } from './InvesterFilterModal';

interface InvestorFlatListProps {
  interestedUsers: any;
  filterStatus: string;
  searchQuery: string;
  isPremiumUser?: boolean;
  filters?: Partial<FilterFormData>; // <-- add this
}

const InvestorFlatList = ({
  interestedUsers,
  filterStatus,
  searchQuery,
  isPremiumUser = false,
  filters = {},
}: InvestorFlatListProps) => {
  const transformedInterestedUsers = interestedUsers[0]?.data?.map((investor: any) => ({
    name: investor?.interestedUsers?.fullName || 'N/A',
    updatedAt: investor?.updatedAt || '',
    location: investor?.interestedUsers?.company?.location || '',
    companyName: investor?.interestedUsers?.company?.name || '',
    interests:
      investor.interestedUsers?.user_profile?.industrySpecialization || [],
    image: investor.interestedUsers?.user_profile?.image || '',
    remark: investor?.remark || 'No remark provided',
    status: investor?.investStatus || 'Pending',
    id: investor?.documentId,
    listingTitle: investor?.listing?.title || '',
    isPremium: investor.isPremium || false,
  }));

  const filteredInvestors = transformedInterestedUsers?.filter(
    (investor: any) => {
      const searchLower = searchQuery?.toLowerCase() || '';
      const statusLower = filterStatus?.toLowerCase() || 'all';

      // ✅ Search Filter
      const matchesSearch =
        investor.name?.toLowerCase().includes(searchLower) ||
        investor.location?.toLowerCase().includes(searchLower) ||
        investor.listingTitle?.toLowerCase().includes(searchLower);

      // ✅ Status Filter
      const matchesStatus =
        statusLower === 'all' || investor.status?.toLowerCase() === statusLower;

      // ✅ Industries Filter
      let matchesIndustries = true;
      if (filters.industries && filters.industries.length > 0) {
        if (Array.isArray(investor.interests)) {
          matchesIndustries = investor.interests.some((interest: string) =>
            filters.industries!.some(
              (filterInd) => interest?.toLowerCase() === filterInd.toLowerCase()
            )
          );
        } else if (typeof investor.interests === 'string') {
          matchesIndustries = filters.industries.some(
            (filterInd) =>
              investor.interests?.toLowerCase() === filterInd.toLowerCase()
          );
        }
      }

      // ✅ Business Name Filter
      let matchesBusinessName = true;
      if (filters.businessName) {
        matchesBusinessName =
          investor.companyName?.toLowerCase() ===
          filters.businessName.toLowerCase();
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesIndustries &&
        matchesBusinessName
      );
    }
  );

  const renderInvestorItem = ({ item }: { item: any }) => (
    <InvestorCard investor={item} isPremiumUser={isPremiumUser} />
  );

  const renderEmptyComponent = () => (
    <NoData
      title="No Investors Yet !"
      description="Your listed business hasn’t received investor interest yet. Once investors engage, you’ll see them here."
    />
  );

  return (
    <FlatList
      data={filteredInvestors}
      renderItem={renderInvestorItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyComponent}
      className="flex-1"
    />
  );
};

export default InvestorFlatList;
