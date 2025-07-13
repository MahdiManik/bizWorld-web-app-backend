import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { subscriptionPlans, mockUserSubscription } from 'data/subscriptionData'

export default function AllPlansScreen() {
  const router = useRouter()
  const subscription = mockUserSubscription
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        {subscriptionPlans.map((plan, index) => (
          <View
            key={plan.id}
            style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <Text style={tw`text-lg font-bold`}>{plan.name}</Text>
              <Text
                style={[
                  tw`text-xl font-bold`,
                  { color: colors.primary.DEFAULT },
                ]}>
                ${plan.price}
                <Text style={tw`text-sm text-gray-500`}>/mo</Text>
              </Text>
            </View>

            {plan.isCurrentPlan && (
              <View style={tw`bg-blue-100 px-2 py-1 rounded mb-3 self-start`}>
                <Text style={tw`text-blue-700 text-xs font-medium`}>
                  Current Plan
                </Text>
              </View>
            )}

            <View>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={tw`flex-row items-center mb-2`}>
                  <View style={tw`bg-green-500 rounded-full p-0.5 mr-2`}>
                    <Feather name="check" size={12} color="white" />
                  </View>
                  <Text style={tw`text-gray-700 text-sm`}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
