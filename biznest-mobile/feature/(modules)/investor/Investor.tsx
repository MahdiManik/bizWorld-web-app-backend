import { View } from 'react-native';
import React, { useState } from 'react';
import Header from '@/components/ui/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import TabBar, { TabItem } from '@/components/ui/tab-bar';
import Button from '@/components/ui/button';
import InvestorList from './InvestorList';

const Investor = () => {
  const [activeTab, setActiveTab] = useState('all');


  const tabs: TabItem[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'decline', label: 'Decline' },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <InvestorList filterStatus="all" />;
      case 'pending':
        return <InvestorList filterStatus="Pending" />;
      case 'accepted':
        return <InvestorList filterStatus="Approved" />;
      case 'decline':
        return <InvestorList filterStatus="Rejected" />;
      default:
        return <InvestorList filterStatus="all" />;
    }
  };

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header
          title="Investor"
          rightComponent={
            <Button title="" icon={<NotiIcon />} onPress={() => {}} />
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

export default Investor;
