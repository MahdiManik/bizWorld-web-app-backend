import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import tw from '@/lib/tailwind'

type Tab = {
  id: string
  label: string
}

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <View
      style={tw`border-b border-gray-200 bg-white w-full justify-between flex-row flex`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={[
            tw`py-4 px-4`,
            activeTab === tab.id ? tw`border-b-2 border-blue-900` : {},
          ]}>
          <Text
            style={[
              tw`font-medium`,
              activeTab === tab.id ? tw`text-blue-900` : tw`text-gray-500`,
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
