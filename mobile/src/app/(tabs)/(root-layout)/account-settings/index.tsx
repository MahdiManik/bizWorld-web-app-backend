import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { ConfirmationModal } from '@/components/profileSettings/ConfirmationModal'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/utils/toast'
import axios from 'axios'
import { getCurrentUserId } from '@/services/auth.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '@/lib/api'
// Mock profile image URL from profileData.tsx

export default function AccountSettingsScreen() {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfile()
  const { logout } = useAuth()
  const toast = useToast()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleEditProfile = () => {
    router.push('/account-settings/edit-personal-info')
  }

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case 'PersonalInfo':
        router.push('/account-settings/personal-info')
        break
      case 'CompanyInfo':
        router.push('/account-settings/company-info')
        break
      case 'MyFavorites':
        router.push('/account-settings/my-favorites')
        break
      case 'Subscriptions':
        router.push('/account-settings/subscription')
        break
      case 'ChangePassword':
        router.push('/account-settings/change-pass')
        break
      case 'Notifications':
        router.push('/account-settings/notifications')
        break
      default:
        router.push(`/account-settings/${screen.toLowerCase()}`)
    }
  }

  if (isLoading && !userProfile) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-4 text-gray-500`}>Loading profile...</Text>
      </View>
    )
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`}>
        {/* Badge positioned at the top-right corner */}
        <View style={tw`absolute top-4 right-4 z-10`}>
          <View
            style={[
              tw`px-3 py-1.5 rounded-full`,
              userProfile?.roles?.includes('premium')
                ? { backgroundColor: '#FFCC33' }
                : { backgroundColor: colors.primary[100] },
            ]}>
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={18}
                color={
                  userProfile?.roles?.includes('premium')
                    ? '#7A5C00'
                    : colors.link
                }
              />
              <Text
                style={[
                  tw`ml-2 font-semibold`,
                  userProfile?.roles?.includes('premium')
                    ? { color: '#7A5C00' }
                    : { color: colors.link },
                ]}>
                {userProfile?.roles?.includes('premium') ? 'Premium' : 'Free'}
              </Text>
            </View>
          </View>
        </View>

        {/* Centered profile image and info */}
        <View style={tw`items-center mt-6 mb-4 px-4`}>
          <View style={tw`relative`}>
            {/* Use mock profile image URL directly */}
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={tw`w-32 h-32 rounded-full`}
            />
            <TouchableOpacity
              style={tw`absolute bottom-0 right-0 bg-white p-3 rounded-full border border-gray-200`}
              onPress={handleEditProfile}>
              <Feather name="edit-2" size={20} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>

          <Text style={tw`text-2xl font-bold mt-4`}>
            {userProfile?.name || 'User'}
          </Text>

          <Text style={tw`text-gray-600 text-center mt-1`}>
            {userProfile?.email || 'No Email'}{' '}
            {userProfile?.phoneNumber ? `| ${userProfile.phoneNumber}` : ''}
          </Text>
        </View>

        <View style={tw`h-px bg-gray-200 mx-4 my-2`} />

        {/* Menu Items */}
        <View style={tw`px-4`}>
          <MenuItem
            icon="user"
            title="Personal Info"
            onPress={() => handleNavigation('PersonalInfo')}
          />

          <MenuItem
            icon="briefcase"
            title="Company Info"
            onPress={() => handleNavigation('CompanyInfo')}
          />

          <MenuItem
            icon="heart"
            title="My Favorites"
            onPress={() => handleNavigation('MyFavorites')}
          />

          <MenuItem
            icon="credit-card"
            title="Subscriptions"
            badge={userProfile?.roles?.includes('premium') ? 'premium' : 'free'}
            onPress={() => handleNavigation('Subscriptions')}
          />

          <MenuItem
            icon="lock"
            title="Change Password"
            onPress={() => handleNavigation('ChangePassword')}
          />

          <MenuItem
            icon="bell"
            title="Notifications"
            onPress={() => handleNavigation('Notifications')}
          />

          <TouchableOpacity
            style={tw`flex-row items-center py-4`}
            onPress={() => setShowDeleteModal(true)}>
            <Feather
              name="trash-2"
              size={24}
              color={colors.error}
              style={tw`mr-4`}
            />
            <Text style={[tw`text-lg`, { color: colors.error }]}>
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center py-4`}
            onPress={() => setShowLogoutModal(true)}>
            <Feather
              name="log-out"
              size={24}
              color={colors.primary.DEFAULT}
              style={tw`mr-4`}
            />
            <Text style={[tw`text-lg`, { color: colors.primary.DEFAULT }]}>
              Logout
            </Text>
          </TouchableOpacity>

          {/* New options */}
          <View style={tw`h-px bg-gray-200 my-2`} />

          <MenuItem
            icon="briefcase"
            title="Services"
            onPress={() => router.push('/account-settings/services')}
          />

          <MenuItem
            icon="message-square"
            title="Auto reply"
            onPress={() => handleNavigation('AutoReply')}
          />

          <MenuItem
            icon="credit-card"
            title="Payment Setting"
            onPress={() => handleNavigation('PaymentSetting')}
          />
        </View>

        {/* Become a Verified Consultant Section */}
        <View
          style={tw`bg-blue-50 rounded-xl p-6 mx-4 my-4 border border-gray-200`}>
          <Text
            numberOfLines={1}
            style={[
              tw`text-lg font-bold text-center mb-3`,
              { color: colors.primary.DEFAULT },
            ]}>
            Become a Verified Consultant
          </Text>

          <Text style={tw`text-gray-700 text-center mb-5 leading-6`}>
            Share your expertise, connect with clients, and grow your business
            by becoming a verified consultant on our platform.
          </Text>

          <TouchableOpacity
            style={[
              tw`rounded-md py-3 px-4 flex-row justify-center items-center`,
              { backgroundColor: colors.primary.DEFAULT },
            ]}
            onPress={() =>
              router.push('/account-settings/consultant-application')
            }>
            <Feather name="user" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-medium text-base`}>
              Apply as Consultant
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          const handleDeleteAccount = async () => {
            try {
              setShowDeleteModal(false)
              const userId = await getCurrentUserId()
              const token = await AsyncStorage.getItem('authToken')

              if (!userId || !token) {
                throw new Error('Authentication failed')
              }

              // In Strapi, users can be marked as blocked or removed completely
              // Here we're choosing to block the user which is safer than deletion
              await api.put(`/users/${userId}`, {
                blocked: true,
              })

              await AsyncStorage.removeItem('authToken')

              setTimeout(() => {
                toast.show('Account successfully deleted', {
                  type: 'success',
                  duration: 3000,
                  placement: 'top',
                })
              }, 500)

              router.replace('/')
            } catch (error) {
              console.error('Delete account error:', error)
              toast.show('Failed to delete account', {
                type: 'danger',
                duration: 3000,
              })
            }
          }
          handleDeleteAccount()
        }}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
        confirmText="Delete Account"
        confirmStyle="danger"
        icon="trash-2"
      />

      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          try {
            setShowLogoutModal(false)
            await logout()
            setTimeout(() => {
              toast.show('Successfully logged out', {
                type: 'success',
                duration: 3000,
                placement: 'top',
              })
            }, 500)
          } catch (error) {
            console.error('Logout error:', error)
            toast.show('Failed to logout', { type: 'danger' })
          }
        }}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Logout"
        icon="log-out"
      />
    </View>
  )
}

type MenuItemProps = {
  icon: string
  title: string
  badge?: string
  onPress: () => void
}

const MenuItem = ({ icon, title, badge, onPress }: MenuItemProps) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between py-4 `}
      onPress={onPress}>
      <View style={tw`flex-row items-center`}>
        <Feather
          name={icon as any}
          size={24}
          color={colors.primary.DEFAULT}
          style={tw`mr-4`}
        />
        <Text style={tw`text-gray-800 text-lg`}>{title}</Text>

        {badge && (
          <View
            style={[
              tw`ml-3 px-3 py-1 rounded-full`,
              badge === 'premium'
                ? { backgroundColor: '#FFCC33' }
                : { backgroundColor: '#E6F0FF' },
            ]}>
            <Text
              style={[
                tw`text-xs font-medium`,
                badge === 'premium'
                  ? { color: '#7A5C00' }
                  : { color: colors.primary[700] },
              ]}>
              {badge === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        )}
      </View>

      <Feather name="chevron-right" size={24} color={colors.black} />
    </TouchableOpacity>
  )
}
