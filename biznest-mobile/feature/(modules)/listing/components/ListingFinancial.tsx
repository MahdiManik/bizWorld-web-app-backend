import { View, Text, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import BusinessDetail from './BusinessDetail';
import OwnerIcon from '@/assets/svgs/listing/OwnerIcon';
import CompanyIcon from '@/assets/svgs/listing/CompanyIcon';
import TypeIcon from '@/assets/svgs/listing/TypeIcon';
import { ListingDetail } from '../types/listing-detail';

interface ListingFinancialProps {
  listing?: ListingDetail;
}
const ListingFinancial = ({ listing }: ListingFinancialProps) => {
  const screenWidth = Dimensions.get('window').width;
  const chartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [
          parseFloat(listing?.revenueBreakDown?.Jan || '0'),
          parseFloat(listing?.revenueBreakDown?.Feb || '0'),
          parseFloat(listing?.revenueBreakDown?.Mar || '0'),
          parseFloat(listing?.revenueBreakDown?.Apr || '0'),
          parseFloat(listing?.revenueBreakDown?.May || '0'),
          parseFloat(listing?.revenueBreakDown?.Jun || '0'),
          parseFloat(listing?.revenueBreakDown?.Jul || '0'),
          parseFloat(listing?.revenueBreakDown?.Aug || '0'),
          parseFloat(listing?.revenueBreakDown?.Sep || '0'),
          parseFloat(listing?.revenueBreakDown?.Oct || '0'),
          parseFloat(listing?.revenueBreakDown?.Nov || '0'),
          parseFloat(listing?.revenueBreakDown?.Dec || '0'),
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => `#4B83E5`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4B83E5',
    },
  };

  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <Text className="font-roboto600 text-base text-title">
          Financial Overview
        </Text>
        <Text className="font-roboto400 text-base text-title">
          Key financial metrics for the business
        </Text>
      </View>

      <View className="gap-2">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8 }}
        >
          <BarChart
            data={chartData}
            width={screenWidth * 1.8}
            height={220}
            chartConfig={chartConfig}
            style={{
              borderRadius: 16,
            }}
            yAxisLabel="$"
            yAxisSuffix="k"
            fromZero
          />
        </ScrollView>
      </View>

      <BusinessDetail
        icon={<OwnerIcon />}
        title="Annual Revenue"
        value={listing?.annualRevenue || ''}
      />
      <BusinessDetail
        icon={<CompanyIcon />}
        title="EBITDA"
        value={listing?.revenueBreakDown?.EBITDA || ''}
      />
      <BusinessDetail
        icon={<TypeIcon />}
        title="Profit Margin"
        value={listing?.profitMargin || ''}
      />

      <Text className="font-roboto500 text-base text-title">
        Note: Detailed financial statements are available upon expressing
        interest and receiving approval from the business owner.
      </Text>
    </View>
  );
};

export default ListingFinancial;
