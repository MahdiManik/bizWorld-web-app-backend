import React, { useState, useEffect } from 'react'
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
import { useUserData } from '@/hooks/useUserProfile'

export default function CompanyInfoScreen() {
  const router = useRouter()
  const { companyInfo, isLoading, error, fetchUserData } = useUserData()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleEditCompanyInfo = () => {
    router.push('/account-settings/edit-company')
  }

  const handleViewDocument = () => {
    if (companyInfo?.documents && companyInfo.documents.length > 0) {
      Linking.openURL(companyInfo.documents[0].url)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchUserData()
    } finally {
      setRefreshing(false)
    }
  }

  const formatRevenue = (revenue: string) => {
    const amount = parseInt(revenue)
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M/year`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K/year`
    }
    return `$${amount}/year`
  }

  const formatCompanySize = (size: string) => {
    return `${size} Members`
  }

  if (isLoading && !companyInfo) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-4 text-gray-500`}>Loading...</Text>
      </View>
    )
  }

  if (error && !companyInfo) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center p-4`}>
        <Feather name="alert-circle" size={50} color={colors.red[500]} />
        <Text style={tw`mt-4 text-gray-700 text-center font-medium`}>
          Error
        </Text>
        <Text style={tw`mt-2 text-gray-500 text-center mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-[${colors.primary.DEFAULT}] py-2 px-4 rounded-md`}
          onPress={() => fetchUserData()}>
          <Text style={tw`text-white font-medium`}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!isLoading && !error && !companyInfo) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center p-4`}>
        <Feather name="briefcase" size={50} color={colors.gray[400]} />
        <Text style={tw`mt-4 text-gray-700 text-center font-medium`}>
          No Company Information
        </Text>
        <Text style={tw`mt-2 text-gray-500 text-center mb-4`}>
          You haven't added company details yet.
        </Text>
        <TouchableOpacity
          style={tw`bg-[${colors.primary.DEFAULT}] py-2 px-4 rounded-md`}
          onPress={handleEditCompanyInfo}>
          <Text style={tw`text-white font-medium`}>Add Company Info</Text>
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
              {companyInfo?.logo ? (
                <Image
                  source={{ uri: companyInfo.logo }}
                  style={tw`w-16 h-16 rounded-full mr-3`}
                />
              ) : (
                <View
                  style={tw`w-16 h-16 rounded-full mr-3 bg-gray-200 items-center justify-center`}>
                  <Feather
                    name="briefcase"
                    size={32}
                    color={colors.gray[400]}
                  />
                </View>
              )}
              <View>
                <Text style={tw`font-bold text-lg`}>
                  {companyInfo?.name || 'Company Name'}
                </Text>
                <Text style={tw`text-gray-600`}>
                  Industry: {companyInfo?.industry || 'Not specified'}
                </Text>
                {companyInfo?.status && (
                  <View style={tw`flex-row items-center mt-1`}>
                    <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2`} />
                    <Text style={tw`text-green-600 capitalize`}>
                      {companyInfo.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={handleEditCompanyInfo}>
              <Feather name="edit-2" size={20} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <CompanyDetailItem
            label="Company Size"
            value={
              companyInfo?.size
                ? formatCompanySize(companyInfo.size)
                : 'Not specified'
            }
          />

          <CompanyDetailItem
            label="Revenue"
            value={
              companyInfo?.revenue
                ? formatRevenue(companyInfo.revenue)
                : 'Not specified'
            }
          />

          <CompanyDetailItem
            label="Location"
            value={companyInfo?.location || 'Not specified'}
          />
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`font-bold text-lg mb-3`}>Document</Text>
          {companyInfo?.documents && companyInfo.documents.length > 0 ? (
            <TouchableOpacity
              style={tw`flex-row items-center justify-between border border-[${colors.primary.DEFAULT}] rounded-md p-3`}
              onPress={handleViewDocument}>
              <View style={tw`flex-row items-center`}>
                <Feather name="file" size={20} color={colors.gray[500]} />
                <View style={tw`ml-2`}>
                  <Text style={tw`text-gray-800`}>
                    {companyInfo.documents[0].name}
                  </Text>
                  <Text style={tw`text-gray-500 text-xs`}>
                    {companyInfo.documents[0].size}
                  </Text>
                </View>
              </View>
              <Feather name="eye" size={20} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          ) : (
            <Text style={tw`text-gray-500 italic`}>No documents uploaded</Text>
          )}
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`font-bold text-lg mb-3`}>Description</Text>
          <Text style={tw`text-gray-700 leading-6`}>
            {companyInfo?.description || 'No company description available.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

type CompanyDetailItemProps = {
  label: string
  value: string
}

const CompanyDetailItem = ({ label, value }: CompanyDetailItemProps) => {
  return (
    <View
      style={tw`flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0`}>
      <Text style={tw`text-gray-600 font-medium`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium`}>: {value}</Text>
    </View>
  )
}
