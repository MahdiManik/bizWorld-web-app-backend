import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import cn from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  className = '',
}) => {
  return (
    <View className={cn('border-b border-stroke-border', className)}>
      <View className="flex-row">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              className={cn(
                'flex-1 flex-row items-center justify-center rounded-md px-3 py-2'
              )}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              {tab.icon && <View className="mr-2">{tab.icon}</View>}
              <Text
                className={cn(
                  'mb-2 font-roboto600 text-base leading-5',
                  isActive ? 'text-primary' : 'text-unselect'
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
      </View>
    </View>
  );
};

export default TabBar;
