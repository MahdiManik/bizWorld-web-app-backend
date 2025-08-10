/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { useRouter } from 'expo-router';
import { ScrollView, View, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import Button from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import PlanCard from './PlanCard';
import Toast from 'react-native-toast-message';

const Plan = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      period: '/mo',
      badge: 'Current Plan',
      badgeColor: 'bg-white',
      nameColor: 'text-gray-lower',
      textColor: 'text-title',
      periodColor: 'text-gray-lower',
      borderColor: 'border-stroke-border',
      isActive: true,
    },
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '$19.99',
      period: '/mo',
      badge: null,
      badgeColor: 'bg-white',
      nameColor: 'text-gray-lower',
      periodColor: 'text-gray-lower',
      textColor: '',
      borderColor: 'border-stroke-border',
      isActive: true,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$49.99',
      period: '/mo',
      badge: 'Most Popular',
      badgeColor: 'bg-white',
      nameColor: 'text-gray-lower',
      periodColor: 'text-gray-lower',
      textColor: '#78350F',
      borderColor: 'gradiant',
      isPopular: true,
    },
    {
      id: 'business',
      name: 'Business Plan',
      price: '$99.99',
      period: '/mo',
      badge: null,
      badgeColor: 'bg-primary',
      nameColor: 'text-white',
      periodColor: 'text-white',
      textColor: 'text-white',
      borderColor: 'border-primary',
      isBusiness: true,
    },
  ];

  const features = [
    'Unlimited Listings',
    '100 GB Document Storage',
    '24/7 Priority Support',
    'Enterprise Analytics',
    'Verified Badge',
    'API Access',
    'Custom Branding',
  ];

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header
          title="Upgrade Plan"
          showBackButton
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="m-4 rounded-md border border-stroke-border shadow">
            <View className="px-4 py-6">
              {/* Available Plan Section */}
              <View className="mb-6">
                <Text className="mb-2 text-center font-roboto600 text-xl text-title">
                  Available Plan
                </Text>
                <Text className="mb-6 text-center font-roboto400 text-sm text-description-text">
                  Choose the plan that best fits your business needs.
                </Text>

                {/* Plan Cards */}
                {Array.from(
                  { length: Math.ceil(plans.length / 2) },
                  (_, rowIndex) => (
                    <View
                      key={rowIndex}
                      className="mb-6 flex-row justify-between gap-4"
                    >
                      {plans
                        .slice(rowIndex * 2, rowIndex * 2 + 2)
                        .map((item) => (
                          <PlanCard
                            key={item.id}
                            name={item.name}
                            price={item.price}
                            period={item.period}
                            badge={item.badge}
                            badgeColor={item.badgeColor}
                            periodColor={item.periodColor}
                            textColor={item.textColor}
                            borderColor={item.borderColor}
                            isActive={item.badge === 'Current Plan'}
                            isPopular={item.badge === 'Most Popular'}
                            nameColor={item.nameColor}
                            onPress={() =>
                              console.log(`Selected: ${item.name}`)
                            }
                          />
                        ))}
                    </View>
                  )
                )}
              </View>

              {/* What's Included Section */}
              <View className="mb-8">
                <Text className="mb-4 font-roboto600 text-lg text-subtitle">
                  What&apos;s Included
                </Text>

                <View className="space-y-3">
                  {features.map((feature, index) => (
                    <View key={index} className="flex-row items-center">
                      <View className="mr-3 h-5 w-5 items-center justify-center rounded-full bg-lightGreen">
                        <Ionicons name="checkmark" size={12} color="white" />
                      </View>
                      <Text className="flex-1 font-roboto400 text-base text-title">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Confirm and Pay Button */}
              <Button
                title="Confirm and Pay"
                onPress={() => {
                  // Handle payment confirmation
                  console.log('Selected plan:', selectedPlan);
                  Toast.show({
                    type: 'error',
                    text1: 'This feature will be included in phase 2',
                  });
                }}
                variant="primary"
                fullWidth
                className="mb-4"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Plan;
