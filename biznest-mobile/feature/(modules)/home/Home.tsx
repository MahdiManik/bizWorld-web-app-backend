import Button from '@/components/ui/button';
import { FontAwesome } from '@expo/vector-icons';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { useSetAtom } from 'jotai';
import { useRouter } from 'expo-router';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import colors from '@/constants/colors';
import Consultants from './Consultants';
import { activeListingTabAtom } from '@/lib/atoms';
import { useActiveListing, useGetListing } from '../listing/hooks/useListing';
import ListingItem from '../listing/components/ListingItem';
import { useGetSuggestConsultants } from '../consultants/hooks/useConsultant';
import { useGetMe } from '@/feature/(auth)/hooks/useAuth';
import { useInvestorUsers } from '../investor/hooks/useInvestor';
export default function Home() {
  const setActiveTab = useSetAtom(activeListingTabAtom);
  const router = useRouter();
  const { data: me } = useGetMe();
  const userId = me?.data?.id;
  const { data: consultants } = useGetSuggestConsultants();
  const { data: activeListing } = useActiveListing();
  const { data: investor } = useInvestorUsers({ userId: Number(userId) });
  const investorData = investor?.pages?.[0]?.data;
  const { data: browseListingData } = useGetListing({
    type: 'browse',
    tab: 'all',
    isDashboard: true,
  });

  const { data: myListingData } = useGetListing({
    type: 'my-listing',
    tab: 'all',
    isDashboard: true,
  });

  // Extract first page data for dashboard display
  const browseListing = browseListingData?.pages?.[0]?.data || [];
  const myListing = myListingData?.pages?.[0]?.data || [];

const approvedCount = useMemo(() => {
  if (!investorData) return 0;
  const count = investorData.data.filter((investor: any) => 
    investor.investStatus?.toLowerCase() === 'approved'
  ).length;

  return count;
}, [investorData]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex flex-row items-center justify-between px-5 py-4">
          <View className="flex flex-row items-center">
            {me?.data?.user_profile?.image?.url ? (
              <Image
                source={{ uri: me.data.user_profile.image.url }}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <FontAwesome
                name="user-circle"
                size={40}
                color={colors.description.text}
              />
            )}
            <View className="ml-3">
              <Text className="font-roboto600 text-lg">
                Hi, {me?.data?.fullName}
              </Text>
              <Text className="text-sm text-gray-500">
                What would you like to consult today?
              </Text>
            </View>
          </View>
          <NotiIcon isBlue />
        </View>

        {/* Stats */}
        <View className="mx-5 my-4 flex-row justify-between">
          <View className="mr-2 flex-1 rounded-xl border border-stroke-border bg-white p-4">
            <Text className="text-sm text-gray-500">Active Listings</Text>
            <Text className="mt-1 text-2xl font-bold">
              {activeListing?.meta?.pagination?.total}
            </Text>
          </View>
          <View className="ml-2 flex-1 rounded-xl border border-stroke-border bg-white p-4">
            <Text className="text-sm text-gray-500">Investor Inquiries</Text>
            <Text className="mt-1 text-2xl font-bold">
              {' '}
              {approvedCount}
            </Text>
          </View>
        </View>

        {/* Your Listings Section */}
        <View className="px-5 py-4">
          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              Your Listings
            </Text>
            <Button
              title="View All"
              onPress={() => {
                setActiveTab('my-listing');
                router.push('/listings');
              }}
              variant="text"
              size="none"
              titleClassName="text-base font-roboto600"
            />
          </View>

          {/* Listing Card */}
          {myListing?.length > 0 &&
            myListing?.map((item) => (
              <ListingItem
                listing={item}
                type="my-listing"
                key={item.documentId}
              />
            ))}
        </View>

        {/* Browse Listings */}
        <View className="px-5 py-4">
          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              Browse Listings
            </Text>
            <Button
              title="View All"
              onPress={() => {
                setActiveTab('browse-listings');
                router.push('/listings');
              }}
              variant="text"
              size="none"
              titleClassName="text-base font-roboto600"
            />
          </View>

          {/* Listing Card */}
          {browseListing?.length > 0 &&
            browseListing?.map((item) => (
              <ListingItem listing={item} type="browse" key={item.documentId} />
            ))}
        </View>
        {/* Browse Listings */}
        <View className="px-5 py-4">
          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              Available Consultants
            </Text>
            <Button
              title="View All"
              onPress={() => {}}
              variant="text"
              size="none"
              titleClassName="text-base font-roboto600"
            />
          </View>

          <ScrollView horizontal contentContainerClassName="gap-5 mb-20">
            {consultants?.map((cons) => (
              <Consultants
                key={cons.documentId}
                name={cons?.fullName || ''}
                url={cons?.user_profile?.image?.url || ''}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
