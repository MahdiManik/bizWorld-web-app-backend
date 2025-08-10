import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import cn from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
export interface ChipTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  className?: string;
}
const ChipTabBar: React.FC<ChipTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  className = '',
}) => {
  return (
    <ScrollView horizontal contentContainerClassName="pb-4">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            className={cn(
              'mr-2 flex items-center justify-center rounded-full px-4 py-2',
              isActive ? 'bg-primary' : 'bg-lightgray'
            )}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              className={cn(
                'font-roboto600 text-base leading-5',
                isActive ? 'text-white' : 'text-subtle'
              )}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View className="absolute bottom-0 left-10 right-10 h-1 rounded-full bg-primary" />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ChipTabBar;
