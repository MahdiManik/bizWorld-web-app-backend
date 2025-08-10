import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAtom } from 'jotai';
import Header from '@/components/ui/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import TabBar, { TabItem } from '@/components/ui/tab-bar';
import { activeListingTabAtom } from '@/lib/atoms';
import BrowseListing from './BrowseListing';
import MyListing from './MyListing';
import MyInterest from './MyInterest';

const Listing = () => {
  const [activeTab, setActiveTab] = useAtom(activeListingTabAtom);

  const tabs: TabItem[] = [
    { id: 'browse-listings', label: 'Browse Listings' },
    { id: 'my-listing', label: 'My Listing' },
    { id: 'my-interest', label: 'My Interest' },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'browse-listings':
        return <BrowseListing />;
      case 'my-listing':
        return <MyListing />;
      case 'my-interest':
        return <MyInterest />;
      default:
        return null;
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
          title="Listings"
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <View className="flex-1">
          <View className="mt-4 px-4">
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
          </View>
          <View className="flex-1">{renderContent()}</View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Listing;
