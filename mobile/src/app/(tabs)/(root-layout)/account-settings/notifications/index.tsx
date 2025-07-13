import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { Header } from '@/components/Listing/Header'
import { mockUserProfile } from 'data/profileData'

type NotificationSetting = {
  id: string
  title: string
  description: string
  enabled: boolean
}

export default function NotificationsScreen() {
  const router = useRouter()
  const initialProfile = mockUserProfile

  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: 'newMessages',
      title: 'New Messages',
      description: 'Get notified when you receive new messages',
      enabled: initialProfile[0].notificationSettings.newMessages,
    },
    {
      id: 'listingViews',
      title: 'Listing Views',
      description: 'Get notified when your listings receive new views',
      enabled: false,
    },
    {
      id: 'investorInterest',
      title: 'Investor Interest',
      description:
        'Get notified when investors express interest in your business',
      enabled: initialProfile[0].notificationSettings.investorInterest,
    },
    {
      id: 'marketingUpdates',
      title: 'Marketing Updates',
      description: 'Receive promotional offers and updates',
      enabled: initialProfile[0].notificationSettings.marketingEmails,
    },
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Get notified about security events like password changes',
      enabled: true,
    },
  ])

  const handleToggleNotification = (id: string) => {
    setNotificationSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`}>
        {notificationSettings.map((setting, index) => (
          <NotificationItem
            key={setting.id}
            setting={setting}
            onToggle={() => handleToggleNotification(setting.id)}
            isLast={index === notificationSettings.length - 1}
          />
        ))}
      </ScrollView>
    </View>
  )
}

type NotificationItemProps = {
  setting: NotificationSetting
  onToggle: () => void
  isLast: boolean
}

const NotificationItem = ({
  setting,
  onToggle,
  isLast,
}: NotificationItemProps) => {
  return (
    <ScrollView style={tw`flex-1`}>
      <View style={[tw`px-4 py-6`, !isLast && tw`border-b border-gray-100`]}>
        <View style={tw`flex-row justify-between items-start`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={tw`text-lg font-medium text-gray-800 mb-1`}>
              {setting.title}
            </Text>
            <Text style={tw`text-gray-600 leading-5`}>
              {setting.description}
            </Text>
          </View>

          <Switch
            value={setting.enabled}
            onValueChange={onToggle}
            trackColor={{
              false: colors.gray[300],
              true: colors.primary.DEFAULT,
            }}
            thumbColor={setting.enabled ? colors.white : colors.white}
            ios_backgroundColor={colors.gray[300]}
          />
        </View>
      </View>
    </ScrollView>
  )
}
