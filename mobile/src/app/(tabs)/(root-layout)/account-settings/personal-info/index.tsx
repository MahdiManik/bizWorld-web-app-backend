import React, { useState, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import useUserProfile from '@/hooks/useUserProfile'
import { getStrapiMedia } from '@/lib/strapi-helpers'

export default function PersonalInfoScreen() {
  const router = useRouter()
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfile()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchUserProfile()
    setRefreshing(false)
  }, [fetchUserProfile])

  const handleEditPersonalInfo = () => {
    router.push('/account-settings/edit-info')
  }

  const handleOpenPortfolio = () => {
    if (userProfile?.profile?.portfolioLink) {
      Linking.openURL(userProfile.profile.portfolioLink)
    }
  }

  if (isLoading && !userProfile) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-4 text-gray-500`}>
          Loading profile information...
        </Text>
      </View>
    )
  }

  if (error && !userProfile) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center p-4`}>
        <Feather name="alert-circle" size={40} color="#FF4040" />
        <Text style={tw`mt-4 text-gray-700 text-center font-medium`}>
          Error loading profile
        </Text>
        <Text style={tw`mt-2 text-gray-500 text-center mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-[${colors.primary.DEFAULT}] py-2 px-4 rounded-md`}
          onPress={() => fetchUserProfile()}>
          <Text style={tw`text-white font-medium`}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              {/* Use user profile image if available, otherwise use default */}
              <Image
                source={{
                  uri: userProfile?.profile?.imageUrl
                    ? getStrapiMedia(userProfile.profile.imageUrl)
                    : 'https://randomuser.me/api/portraits/men/32.jpg',
                }}
                style={tw`w-16 h-16 rounded-full mr-3`}
              />
              <View>
                <Text style={tw`font-bold text-lg`}>
                  {userProfile?.name || 'User Name'}
                </Text>
                <Text style={tw`text-gray-600`}>
                  Industry:{' '}
                  {userProfile?.profile?.industrySpecialization ||
                    'Not specified'}
                </Text>
                <Text style={tw`text-gray-600`}>
                  {userProfile?.profile?.professionalHeadline || 'No headline'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleEditPersonalInfo}>
              <Feather name="edit-2" size={20} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>

          <View style={tw`mt-4`}>
            <ContactItem
              icon="mail"
              value={userProfile?.email || 'N/A'}
              onPress={() =>
                userProfile?.email &&
                Linking.openURL(`mailto:${userProfile.email}`)
              }
            />

            <ContactItem
              icon="phone"
              value={userProfile?.phoneNumber || 'N/A'}
              onPress={() =>
                userProfile?.phoneNumber &&
                Linking.openURL(
                  `tel:${userProfile.phoneNumber.replace(/\s/g, '')}`
                )
              }
            />
          </View>
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`font-bold text-lg mb-2`}>Introduction</Text>
          <Text style={tw`text-gray-700 leading-6`}>
            {userProfile?.profile?.introduction || 'No introduction provided'}
          </Text>
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`font-bold text-lg mb-2`}>Areas of Expertise</Text>
          <View>
            {userProfile?.profile?.areasOfExpertise &&
            Array.isArray(userProfile.profile.areasOfExpertise) &&
            userProfile.profile.areasOfExpertise.length > 0 ? (
              userProfile.profile.areasOfExpertise.map(
                (area: string, index: number) => (
                  <View key={index} style={tw`flex-row items-center mb-2`}>
                    <View
                      style={tw`w-2 h-2 rounded-full bg-[${colors.primary.DEFAULT}] mr-2`}
                    />
                    <Text style={tw`text-gray-700`}>{area}</Text>
                  </View>
                )
              )
            ) : (
              <Text style={tw`text-gray-500 italic`}>
                No areas of expertise specified
              </Text>
            )}
          </View>
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`font-bold text-lg mb-2`}>Portfolio Link</Text>
          {userProfile?.profile?.portfolioLink ? (
            <TouchableOpacity onPress={handleOpenPortfolio}>
              <Text style={tw`text-[${colors.primary.DEFAULT}] underline`}>
                {userProfile.profile.portfolioLink}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={tw`text-gray-500 italic`}>
              No portfolio link provided
            </Text>
          )}
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`font-bold text-lg mb-2`}>Document</Text>
          {/* This is a placeholder - in a real implementation, you would check if a document exists */}
          {userProfile?.profile?.id ? (
            <TouchableOpacity
              style={tw`flex-row items-center justify-between border border-gray-200 rounded-md p-3`}
              onPress={() => {}}>
              <View style={tw`flex-row items-center`}>
                <Feather name="file" size={20} color={colors.gray[500]} />
                <View style={tw`ml-2`}>
                  <Text style={tw`text-gray-800`}>document_name.pdf</Text>
                  <Text style={tw`text-gray-500 text-xs`}>50 mb</Text>
                </View>
              </View>
              <Feather name="eye" size={20} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          ) : (
            <Text style={tw`text-gray-500 italic`}>No document available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

type ContactItemProps = {
  icon: string
  value: string
  onPress?: () => void
}

const ContactItem = ({ icon, value, onPress }: ContactItemProps) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center mt-2`}
      onPress={onPress}
      disabled={!onPress}>
      <View style={tw`w-8 items-center`}>
        <Feather name={icon as any} size={18} color={colors.primary.DEFAULT} />
      </View>
      <Text style={tw`text-gray-700 ml-2`}>{value}</Text>
    </TouchableOpacity>
  )
}
