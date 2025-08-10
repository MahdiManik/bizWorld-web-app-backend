/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { useRouter } from 'expo-router';
import { ScrollView, View, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import Button from '@/components/ui/button';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import PlanCard from '../plan/PlanCard';

const ProUpgrade = () => {
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
      textColor: 'text-title',
      nameColor: 'text-gray-lower',
      periodColor: 'text-gray-lower',
      borderColor: 'border-stroke-border',
      isActive: true,
    },

    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$49.99',
      period: '/mo',
      badge: 'Most Popular',
      badgeColor: '',
      periodColor: 'text-white',
      textColor: 'text-white',
      nameColor: 'text-white',
      borderColor: 'gradiant',
      isPopular: true,
    },
  ];

  const features = [
    'Unlimited Listings',
    '100 GB Document Storage',
    '24/7 Priority Support',
    'Enterprise Analytics',
    'Verified Badge',
  ];

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header
          title="Upgrade To Pro"
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
              {/* Upgrade to Pro Section */}

              <View className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#FBCF47] to-[#F79800] text-center">
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={36}
                  color="white"
                />
              </View>
              <View className="mb-6">
                <Text className="mb-2 text-center font-roboto600 text-xl text-title">
                  Upgrade to Pro
                </Text>
                <Text className="mb-6 text-center font-roboto400 text-sm text-description-text">
                  Unlock premium features and take your business to the next
                  level
                </Text>

                {/* Plan Cards */}
                {Array.from(
                  { length: Math.ceil(plans.length / 2) },
                  (_, rowIndex) => (
                    <View
                      key={rowIndex}
                      className="mb-4 flex-row justify-between"
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
                            nameColor={item.nameColor}
                            textColor={item.textColor}
                            borderColor={item.borderColor}
                            isActive={item.badge === 'Current Plan'}
                            isPopular={item.badge === ''}
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

              {/* Billing */}

              <View className="mb-6 rounded-lg border border-stroke-border bg-white p-4">
                <Text className="mb-2 font-roboto500 text-sm text-title">
                  Billing Summary
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="font-roboto400 text-sm text-subtle">
                    Pro Plan (Monthly)
                  </Text>
                  <Text className="font-roboto400 text-sm text-subtle">
                    $49.99
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="font-roboto400 text-sm text-subtle">
                    Tax
                  </Text>
                  <Text className="my-2 font-roboto400 text-sm text-subtle">
                    $4.50
                  </Text>
                </View>
                <View className="flex-row items-center justify-between border-t border-stroke-border pt-2">
                  <Text className="font-roboto500 text-sm text-subtle">
                    Total
                  </Text>
                  <Text className="my-2 font-roboto500 text-sm text-subtle">
                    $54.49
                  </Text>
                </View>
              </View>

              {/* Confirm and Pay Button */}
              <Button
                title="Upgrade to Pro - $49.99/month"
                onPress={() => {
                  // Handle payment confirmation
                  console.log('Selected plan:', selectedPlan);
                  router.push(
                    '/(module)/(a-root)/account-settings/subscriptions/pro'
                  );
                }}
                fullWidth
                className="mb-4 bg-gradient-to-r from-[#FBCF47] to-[#F79800]"
              />
              <Button
                title="View All Plans"
                onPress={() => {
                  // Handle payment confirmation
                  console.log('Selected plan:', selectedPlan);
                  router.push(
                    '/(module)/(a-root)/account-settings/subscriptions/pro'
                  );
                }}
                variant="outline"
                fullWidth
                className="mb-4 h-10 bg-[#F5F4F8] p-4"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProUpgrade;
