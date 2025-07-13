import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import {
  setActiveListingTab,
  getCurrentNavTab,
  setCurrentNavTab,
} from '@/utils/navigationState'
import { colors } from '@/constants/colors'
import { MoreMenuModal } from './MoreMenuModal'

const Navbar = () => {
  const router = useRouter()

  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const [activeTab, setActiveTab] = useState(getCurrentNavTab())

  const isActive = (path: string) => {
    return activeTab === path
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTab = getCurrentNavTab()
      if (currentTab !== activeTab) {
        setActiveTab(currentTab)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [activeTab])

  const navigateTo = (route: string, tab?: string) => {
    setActiveTab(route)
    setCurrentNavTab(route)

    if (tab) {
      setActiveListingTab(tab)
    }
    router.push(route)
  }

  return (
    <>
      <View
        style={[
          tw`flex-row bg-white mt-auto`,
          {
            shadowColor: colors.secondary[500],
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        ]}>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center`}
          onPress={() => navigateTo('/dashboard')}>
          <Feather
            name="home"
            size={22}
            color={
              isActive('/dashboard')
                ? colors.primary.DEFAULT
                : colors.secondary[600]
            }
          />
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                color: isActive('/dashboard')
                  ? colors.primary.DEFAULT
                  : colors.secondary[600],
              },
            ]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center`}
          onPress={() => navigateTo('/listing', 'browse')}>
          <Feather
            name="list"
            size={22}
            color={
              isActive('/listing')
                ? colors.primary.DEFAULT
                : colors.secondary[600]
            }
          />
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                color: isActive('/listing')
                  ? colors.primary.DEFAULT
                  : colors.secondary[600],
              },
            ]}>
            Listings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center`}
          onPress={() => navigateTo('/chat')}>
          <Feather
            name="message-circle"
            size={22}
            color={
              isActive('/chat') ? colors.primary.DEFAULT : colors.secondary[600]
            }
          />
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                color: isActive('/chat')
                  ? colors.primary.DEFAULT
                  : colors.secondary[600],
              },
            ]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center`}
          onPress={() => navigateTo('/investors')}>
          <Feather
            name="users"
            size={22}
            color={
              isActive('/investors')
                ? colors.primary.DEFAULT
                : colors.secondary[600]
            }
          />
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                color: isActive('/investors')
                  ? colors.primary.DEFAULT
                  : colors.secondary[600],
              },
            ]}>
            Investors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center`}
          onPress={() => setShowMoreMenu(!showMoreMenu)}>
          <Feather
            name={showMoreMenu ? 'x' : 'more-horizontal'}
            size={22}
            color={
              showMoreMenu || isActive('/profile')
                ? colors.primary.DEFAULT
                : colors.secondary[600]
            }
          />
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                color:
                  showMoreMenu || isActive('/profile')
                    ? colors.primary.DEFAULT
                    : colors.secondary[600],
              },
            ]}>
            More
          </Text>
        </TouchableOpacity>
      </View>

      {/* More Menu Modal */}
      <MoreMenuModal
        visible={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        options={[
          {
            id: 'consultants',
            title: 'Consultants',
            icon: 'headphones',
            onPress: () => navigateTo('/consultants'),
          },
          {
            id: 'favorites',
            title: 'My Favorites',
            icon: 'heart',
            onPress: () => navigateTo('/account-settings/my-favorites'),
          },
          {
            id: 'account',
            title: 'Account Settings',
            icon: 'user',
            onPress: () => navigateTo('/account-settings'),
          },
        ]}
      />
    </>
  )
}

export default Navbar
