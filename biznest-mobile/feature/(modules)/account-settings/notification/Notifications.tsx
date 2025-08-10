import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { View } from 'react-native';
import NotificationItem from './NotificationItem';

const Notifications = () => {
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Notifications" showBackButton />
        <View className="gap-6 p-4">
          <NotificationItem
            title="New Messages"
            description="Get notified when you receive new messages"
          />
          <NotificationItem
            title="Listing Views"
            description="Get notified when your listings receive new views"
          />
          <NotificationItem
            title="Investor Interest"
            description="Get notified when investors express interest in your business"
          />
          <NotificationItem
            title="Security Alerts"
            description="Get notified about security events like password changes"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Notifications;
