import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

import {
  SubscriptionPlan,
  subscriptionPlans,
  mockUserSubscription,
} from 'data/subscriptionData'

export default function UpgradePlanScreen() {
  const router = useRouter()
  const subscription = mockUserSubscription
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  )

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
  }

  const handleConfirmAndPay = () => {
    if (!selectedPlan) return

    if (selectedPlan.id === 'free') {
      router.back()
      return
    }

    Alert.alert(
      'Subscription Upgrade',
      `You selected the ${selectedPlan.name} plan for $${selectedPlan.price}/month.`,
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

  const businessPlanFeatures = [
    'Unlimited Listings',
    '100 GB Document Storage',
    '24/7 Priority Support',
    'Enterprise Analytics',
    'Verified Badge',
    'API Access',
    'Custom Branding',
  ]

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`bg-white rounded-lg shadow-sm p-6 mb-6`}>
          <Text style={tw`text-2xl font-bold text-center mb-2`}>
            Available Plan
          </Text>
          <Text style={tw`text-gray-600 text-center mb-6`}>
            Choose the plan that best fits your business needs.
          </Text>

          <View style={tw`flex-row flex-wrap justify-between mb-6`}>
            {subscriptionPlans.map((plan: any) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  tw`w-[48%] mb-4 rounded-lg border-2 p-4`,
                  plan.isCurrentPlan
                    ? tw`border-blue-300 bg-blue-50`
                    : selectedPlan?.id === plan.id
                      ? [
                          tw`border-2 bg-blue-50`,
                          { borderColor: colors.primary.DEFAULT },
                        ]
                      : plan.isPopular
                        ? tw`border-yellow-400 bg-yellow-50`
                        : plan.id === 'business'
                          ? [
                              tw`border-2`,
                              {
                                borderColor: colors.primary.DEFAULT,
                                backgroundColor: colors.primary.DEFAULT,
                              },
                            ]
                          : tw`border-gray-200 bg-white`,
                ]}
                onPress={() => handlePlanSelect(plan)}>
                {plan.isPopular && (
                  <View
                    style={tw`absolute -top-2 left-1/2 transform -translate-x-1/2`}>
                    <View style={tw`bg-yellow-400 px-3 py-1 rounded-full`}>
                      <Text style={tw`text-yellow-900 text-xs font-bold`}>
                        Most Popular
                      </Text>
                    </View>
                  </View>
                )}

                <View style={tw`items-center`}>
                  <Text
                    style={[
                      tw`text-2xl font-bold mb-1`,
                      plan.id === 'business'
                        ? tw`text-white`
                        : tw`text-gray-800`,
                    ]}>
                    ${plan.price}
                    <Text
                      style={[
                        tw`text-sm font-normal`,
                        plan.id === 'business'
                          ? tw`text-white`
                          : tw`text-gray-500`,
                      ]}>
                      /mo
                    </Text>
                  </Text>

                  <Text
                    style={[
                      tw`font-medium mb-3`,
                      plan.id === 'business'
                        ? tw`text-white`
                        : tw`text-gray-700`,
                    ]}>
                    {plan.name}
                  </Text>

                  {plan.isCurrentPlan && (
                    <View style={tw`bg-blue-500 px-3 py-1 rounded-full`}>
                      <Text style={tw`text-white text-xs font-medium`}>
                        Current Plan
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={tw`bg-white rounded-lg shadow-sm p-6 mb-6`}>
          <Text style={tw`text-xl font-bold mb-4`}>What's Included</Text>

          {businessPlanFeatures.map((feature, index) => (
            <View key={index} style={tw`flex-row items-center mb-3`}>
              <View style={tw`bg-green-500 rounded-full p-1 mr-3`}>
                <Feather name="check" size={14} color="white" />
              </View>
              <Text style={tw`text-gray-700 text-lg`}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            tw`rounded-md py-4 items-center mb-6`,
            { backgroundColor: colors.primary.DEFAULT }
          ]}
          onPress={handleConfirmAndPay}
          disabled={!selectedPlan}>
          <Text style={tw`text-white font-bold text-lg`}>Confirm and Pay</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
