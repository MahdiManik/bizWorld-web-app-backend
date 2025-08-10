import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import { AntDesign, Entypo } from '@expo/vector-icons';
import TabBar from '@/components/ui/tab-bar';
import ListingOverview from './ListingOverview';
import ListingFinancial from './ListingFinancial';
import ListingDocuments from './ListingDocuments';
import { useLocalSearchParams } from 'expo-router';
import {
  useGetListingDetail,
  useLikeandUnlikeListing,
} from '../hooks/useListing';
import colors from '@/constants/colors';
import useSession from '@/store/session';

const ListingDetail = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const { documentId, isMylisting } = useLocalSearchParams();
  const { data } = useGetListingDetail(documentId as string);
  const { mutateAsync } = useLikeandUnlikeListing();
  const { user } = useSession();
  const userId = user?.documentId?.toString() || user?.id?.toString() || '';

  const isFavourite = data?.data?.likedUser.some(
    (like) => like.documentId == userId
  );

  const handleLike = async () => {
    let likedUsers =
      data?.data?.likedUser?.map((like) => like.documentId) || [];
    if (isFavourite) {
      likedUsers = likedUsers.filter((like) => like !== userId);
    } else {
      likedUsers.push(userId);
    }

    await mutateAsync({ id: data?.data?.documentId!, likedUser: likedUsers });
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <ListingOverview listing={data?.data} />;
      case 'Financials':
        return <ListingFinancial listing={data?.data} />;
      case 'Documents':
        return (
          <ListingDocuments
            listing={data?.data}
            isMylisting={isMylisting?.toString()}
          />
        );

      default:
        return <ListingOverview listing={data?.data} />;
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
          title="Information"
          showBackButton
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <ScrollView contentContainerClassName="p-4 gap-4">
          <View>
            <Image
              source={{ uri: data?.data?.image?.url }}
              alt="listing"
              className="relative h-40 w-full rounded-lg object-cover"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-[#FFFFFF7D] p-2.5"
              onPress={() => handleLike()}
            >
              {isFavourite ? (
                <AntDesign name="heart" size={14} color={colors.red} />
              ) : (
                <AntDesign name="hearto" size={14} color="black" />
              )}
            </TouchableOpacity>
          </View>
          <View className="self-start rounded-full border border-primary px-4 py-2">
            <Text className="font-roboto500 text-base text-primary">
              {data?.data?.category}
            </Text>
          </View>
          <View className="gap-2">
            <Text>{data?.data?.title}</Text>
            <View className="flex-row gap-4">
              <Entypo name="location-pin" size={24} color="black" />
              <Text>{data?.data?.country}</Text>
            </View>
          </View>
          <TabBar
            tabs={[
              { id: 'Overview', label: 'Overview' },
              { id: 'Financials', label: 'Financials' },
              { id: 'Documents', label: 'Documents' },
            ]}
            activeTab={activeTab}
            onTabPress={(id) => setActiveTab(id)}
          />
          <View className="flex-1">{renderContent()}</View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ListingDetail;
