import { View, Text } from 'react-native';
import React from 'react';
import OwnerIcon from '@/assets/svgs/listing/OwnerIcon';
import BusinessDetail from './BusinessDetail';
import CompanyIcon from '@/assets/svgs/listing/CompanyIcon';
import IndustryIcon from '@/assets/svgs/listing/IndustryIcon';
import TypeIcon from '@/assets/svgs/listing/TypeIcon';
import CountryIcon from '@/assets/svgs/listing/CountryIcon';
import EstablishIcon from '@/assets/svgs/listing/EstablishIcon';
import { ListingDetail } from '../types/listing-detail';

interface ListingOverviewProps {
  listing?: ListingDetail;
}
const ListingOverview = ({ listing }: ListingOverviewProps) => {
  return (
    <View className="flex-1 gap-4">
      <Text className="font-roboto600 text-base text-title">
        Business Description
      </Text>
      <Text className="font-roboto400 text-base text-title">
        {listing?.businessOwner?.company?.description}
      </Text>
      <Text className="font-roboto600 text-base text-title">
        Business Detail
      </Text>
      <BusinessDetail
        icon={<OwnerIcon />}
        title="Business Owner"
        value={listing?.businessOwner?.fullName || ''}
      />
      <BusinessDetail
        icon={<CompanyIcon />}
        title="Company Name"
        value={listing?.businessOwner?.company?.name || ''}
      />
      <BusinessDetail
        icon={<IndustryIcon />}
        title="Industry"
        value={listing?.businessOwner?.company?.industry || ''}
      />
      <BusinessDetail
        icon={<TypeIcon />}
        title="Type"
        value={listing?.category || ''}
      />
      <BusinessDetail
        icon={<CountryIcon />}
        title="Country"
        value={listing?.country || ''}
      />
      <BusinessDetail
        icon={<EstablishIcon />}
        title="Established"
        value={listing?.established?.toString() || ''}
      />
      <BusinessDetail
        icon={<EstablishIcon />}
        title="Employee"
        value={listing?.employees?.toString() || ''}
      />

      <Text className="font-roboto600 text-base text-title">
        Investment Opportunity
      </Text>
      <BusinessDetail
        icon={<OwnerIcon />}
        title="Asking Price:"
        value={listing?.askingPrice?.toString() || ''}
      />
      <BusinessDetail
        icon={<CompanyIcon />}
        title="Equity Offered:"
        value={listing?.equityOffered?.toString() || ''}
      />
      <BusinessDetail
        icon={<IndustryIcon />}
        title="Revenue (Annual):"
        value={listing?.annualRevenue?.toString() || ''}
      />
      <BusinessDetail
        icon={<TypeIcon />}
        title="Profit Margin:"
        value={listing?.profitMargin?.toString() || ''}
      />
      <BusinessDetail
        icon={<CountryIcon />}
        title="Growth Rate:"
        value={listing?.growthRate?.toString() || ''}
      />
    </View>
  );
};

export default ListingOverview;
