import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { mockUserSubscription } from 'data/subscriptionData'
import { colors } from '@/constants/colors'

export default function SubscriptionsScreen() {
  const router = useRouter()
  const [subscription, setSubscription] = useState(mockUserSubscription)

  const { currentPlan, usage, paymentMethods } = subscription

  const handleUpgrade = () => {
    Alert.alert('Upgrade Plan', 'This feature will be implemented soon.')
  }

  const handleChangePlan = () => {
    router.push('/account-settings/subscription/upgrade-plan')
  }

  const handleUpgradeToPro = () => {
    router.push('/account-settings/subscription/upgrade-pro')
  }

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'This feature will be implemented soon.')
  }

  const handleRemovePaymentMethod = (methodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Payment method removed successfully!')
          },
        },
      ]
    )
  }

  const formatUsage = (
    used: number,
    total: number | string,
    unit: string = ''
  ) => {
    if (total === 'unlimited') {
      return `${used} used of unlimited`
    }
    return `${used} ${unit} used of ${total} ${unit}`
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <Text style={tw`text-lg font-bold`}>Current Plan</Text>
            <Text style={tw`text-gray-600`}>{currentPlan.name}</Text>
          </View>

          <Text style={tw`text-gray-600 mb-4`}>
            Manage your subscription and billing details
          </Text>

          <View style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <Text style={tw`font-bold text-lg`}>{currentPlan.name}</Text>
              <View style={tw`bg-green-100 px-2 py-1 rounded`}>
                <Text style={tw`text-green-700 text-xs font-medium`}>
                  Active
                </Text>
              </View>
            </View>

            <Text style={tw`text-gray-600 mb-4`}>
              ${currentPlan.price}/month, billed monthly
            </Text>

            <View style={tw`flex-row mb-4`}>
              <View style={tw`flex-1 mr-2`}>
                <View style={tw`bg-gray-50 rounded-lg p-3 items-center`}>
                  <Text style={tw`text-2xl font-bold text-gray-800`}>
                    {usage.activeListings.used}
                  </Text>
                  <Text style={tw`text-gray-600 text-center text-sm`}>
                    Active Listings
                  </Text>
                  <Text style={tw`text-gray-500 text-xs text-center mt-1`}>
                    {formatUsage(
                      usage.activeListings.used,
                      usage.activeListings.total
                    )}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-1 ml-2`}>
                <View style={tw`bg-gray-50 rounded-lg p-3 items-center`}>
                  <Text style={tw`text-2xl font-bold text-gray-800`}>
                    {usage.documentStorage.used} GB
                  </Text>
                  <Text style={tw`text-gray-600 text-center text-sm`}>
                    Document Storage
                  </Text>
                  <Text style={tw`text-gray-500 text-xs text-center mt-1`}>
                    {formatUsage(
                      usage.documentStorage.used,
                      usage.documentStorage.total,
                      usage.documentStorage.unit
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`bg-blue-50 rounded-lg p-4 mb-4`}>
              <Text style={tw`font-bold text-blue-900 mb-1`}>
                Upgrade to unlock more features
              </Text>
              <Text style={tw`text-blue-700 text-sm mb-3`}>
                Get more listings, storage, and premium support.
              </Text>

              <TouchableOpacity
                style={[
                  tw`rounded-md py-2 px-4 items-center`,
                  { backgroundColor: colors.primary.DEFAULT },
                ]}
                onPress={handleUpgrade}>
                <Text style={tw`text-white font-medium`}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-row`}>
              <TouchableOpacity
                style={tw`flex-1 border border-gray-300 rounded-md py-2 px-4 mr-2 items-center`}
                onPress={handleChangePlan}>
                <Text style={tw`text-gray-700 font-medium`}>Change Plan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw`flex-1 rounded-md py-2 px-4 ml-2 items-center`,
                  { backgroundColor: colors.primary.DEFAULT },
                ]}
                onPress={handleUpgradeToPro}>
                <Text style={tw`text-white font-medium`}>Upgrade to Pro</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`bg-gray-50 rounded-lg p-4 items-center`}>
            <Text style={tw`text-gray-600 text-center`}>
              No Active Subscription
            </Text>
          </View>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-bold mb-2`}>Payment Methods</Text>
          <Text style={tw`text-gray-600 mb-4`}>
            Manage your payment methods and billing preferences
          </Text>

          {paymentMethods.map((method: any) => (
            <View
              key={method.id}
              style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-3`}>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`bg-blue-100 rounded-lg p-2 mr-3`}>
                    <Text style={tw`text-blue-700 font-bold text-xs`}>
                      PayPal
                    </Text>
                  </View>

                  <View>
                    <View style={tw`flex-row items-center`}>
                      <Text style={tw`font-medium mr-2`}>{method.name}</Text>
                      {method.isDefault && (
                        <View style={tw`bg-gray-100 px-2 py-1 rounded`}>
                          <Text style={tw`text-gray-700 text-xs`}>
                            {method.details}
                          </Text>
                        </View>
                      )}
                    </View>
                    {method.expiryDate && (
                      <Text style={tw`text-gray-500 text-sm`}>
                        Expires {method.expiryDate}
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemovePaymentMethod(method.id)}>
                  <Feather name="trash-2" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={tw`border border-dashed border-gray-300 rounded-lg p-4 items-center`}
            onPress={handleAddPaymentMethod}>
            <View style={tw`flex-row items-center`}>
              <Feather name="plus" size={20} color={colors.primary.DEFAULT} />
              <Text
                style={[
                  tw`font-medium ml-2`,
                  { color: colors.primary.DEFAULT },
                ]}>
                Add payment method
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
