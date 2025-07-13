import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'

import { colors } from '@/constants/colors'
import {
  calculateTax,
  calculateTotal,
  subscriptionPlans,
  mockUserSubscription,
} from 'data/subscriptionData'

export default function UpgradeToProScreen() {
  const router = useRouter()
  const subscription = mockUserSubscription
  const proPlan = subscriptionPlans.find((plan: any) => plan.id === 'pro')
  const freePlan = subscriptionPlans.find((plan: any) => plan.id === 'free')

  if (!proPlan || !freePlan) return null

  const tax = calculateTax(proPlan.price)
  const total = calculateTotal(proPlan.price)

  const handleUpgrade = () => {
    Alert.alert(
      'Subscription Upgrade',
      `You selected the ${proPlan.name} plan for $${proPlan.price}/month.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Your subscription has been updated!')
            router.back()
          },
        },
      ]
    )
  }

  const handleViewAllPlans = () => {
    router.push('/account-settings/subscription/all-plans')
  }

  const proFeatures = [
    'Unlimited Listings',
    '100 GB Document Storage',
    '24/7 Priority Support',
    'Enterprise Analytics',
    'Verified Badge',
  ]

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`bg-white rounded-lg shadow-sm p-6 mb-6`}>
          <View style={tw`items-center mb-6`}>
            <View
              style={tw`bg-yellow-400 rounded-full w-20 h-20 items-center justify-center`}>
              <MaterialCommunityIcons name="crown" size={32} color="white" />
            </View>
          </View>

          <Text style={tw`text-2xl font-bold text-center mb-2`}>
            Upgrade to Pro
          </Text>
          <Text style={tw`text-gray-600 text-center mb-6`}>
            Unlock premium features and take your business to the next level
          </Text>

          <View style={tw`flex-row mb-6`}>
            <View style={tw`flex-1 mr-2 border border-gray-200 rounded-lg p-4`}>
              <View style={tw`items-center`}>
                <Text style={[tw`text-2xl font-bold text-gray-800 mb-1`, {flexShrink: 1}]}>
                  $0
                  <Text style={tw`text-sm font-normal text-gray-500`}>/mo</Text>
                </Text>
                <Text style={[tw`font-medium text-gray-700 mb-3`, {flexShrink: 1}]}>
                  Free Plan
                </Text>
                <View
                  style={[
                    tw`px-4 py-1 rounded-full border`,
                    {
                      borderColor: '#2079FF',
                      backgroundColor: '#E6F0FF',
                      minWidth: 100,
                    },
                  ]}>
                  <Text
                    style={[
                      tw`text-xs text-center`,
                      { color: '#2079FF', whiteSpace: 'nowrap' },
                    ]}>
                    Current Plan
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-1 ml-2 bg-yellow-400 rounded-lg p-4`}>
              <View style={tw`items-center justify-center h-full`}>
                <Text style={[tw`text-2xl font-bold text-center text-white mb-1`, {flexShrink: 1}]}>
                  ${proPlan.price}
                  <Text style={tw`text-sm font-normal text-white`}>/mo</Text>
                </Text>
                <Text style={[tw`font-medium text-center text-white`, {flexShrink: 1}]}>
                  Pro Plan
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-6 mb-6`}>
          <Text style={tw`text-xl font-bold mb-4`}>What's Included</Text>

          {proFeatures.map((feature, index) => (
            <View key={index} style={tw`flex-row items-center mb-3`}>
              <View style={tw`bg-green-500 rounded-full p-1 mr-3`}>
                <Feather name="check" size={14} color="white" />
              </View>
              <Text style={tw`text-gray-700 text-lg`}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Billing Summary</Text>

          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`text-gray-700`}>Pro Plan (Monthly)</Text>
            <Text style={tw`text-gray-800 font-medium`}>${proPlan.price}</Text>
          </View>

          <View style={tw`flex-row justify-between mb-3`}>
            <Text style={tw`text-gray-700`}>Tax</Text>
            <Text style={tw`text-gray-800 font-medium`}>${tax}</Text>
          </View>

          <View style={tw`border-t border-gray-200 pt-3`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-lg font-bold`}>Total</Text>
              <Text style={tw`text-lg font-bold`}>
                ${total.toFixed(2)}/month
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={tw`bg-yellow-400 rounded-md py-4 items-center mb-4`}
          onPress={handleUpgrade}>
          <Text style={tw`text-white font-bold text-lg`}>
            Upgrade to Pro - ${proPlan.price}/month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[tw`items-center py-4 px-6 rounded-lg bg-gray-50`, { elevation: 3 }]}
          onPress={handleViewAllPlans}>
          <Text style={[tw`font-medium text-lg`, { color: colors.gray[500] }]}>
            View All Plans
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
