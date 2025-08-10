import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { useRouter } from 'expo-router';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Button from '@/components/ui/button';
import { Feather } from '@expo/vector-icons';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import Toast from 'react-native-toast-message';

const Subscription = () => {
  const router = useRouter();
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header
          title="Subscription"
          showBackButton
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            className="m-4 flex-1 rounded-md bg-gray-white p-4"
            style={{
              shadowColor: '#0000000F',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 6,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#DDDDDD',
            }}
          >
            {/* Current Plan */}
            <View className="mb-4 flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-roboto500 text-base text-title">
                  Current Plan
                </Text>
                <Text className="font-roboto text-description mb-4 text-sm">
                  Manage your subscription and billing details
                </Text>
              </View>
              <Text className="rounded-md bg-lightgray px-3 py-1 font-roboto500 text-base text-description-text">
                Free Plan
              </Text>
            </View>
            {/* Plan Details */}
            <View className="mt-4 flex-row items-start justify-between rounded-md border border-stroke-border bg-white p-4">
              <View className="flex-1">
                <Text className="font-roboto500 text-base text-description-text">
                  Free Plan
                </Text>
                <Text className="font-roboto mb-4 text-xs text-gray-lower">
                  $0/month, billed monthly
                </Text>
              </View>
              <Text className="rounded-md bg-gray-pale px-2 py-1 font-roboto500 text-sm text-green">
                Active
              </Text>
            </View>

            {/* Stats */}
            <View className="my-4 flex-row justify-between">
              <View className="mr-2 flex-1 rounded-xl border border-stroke-border bg-white p-4">
                <Text className="mt-1 text-center font-roboto500 text-base text-[#474747]">
                  1
                </Text>
                <Text className="text-center text-sm text-[#959595]">
                  Active Listings
                </Text>
                <Text className="text-center text-xs text-[#959595]">
                  1 used of 1
                </Text>
              </View>
              <View className="ml-2 flex-1 rounded-xl border border-stroke-border bg-white p-4">
                <Text className="mt-1 text-center font-roboto500 text-base text-[#474747]">
                  1 GB
                </Text>
                <Text className="text-center text-sm text-[#959595]">
                  Document Storage
                </Text>
                <Text className="text-center text-xs text-[#959595]">
                  1.5 GB used of 2 GB
                </Text>
              </View>
            </View>

            {/* Upgrade Plan */}
            <View className="mt-4 flex items-center justify-center rounded-md border border-[#98A2B3] bg-secondary p-4">
              <Text className="font-roboto500 text-base text-[#002C69]">
                Upgrade to unlock more features
              </Text>
              <Text className="my-2 text-center text-xs text-description-text">
                Get more listings, storage, and premium support.
              </Text>
              <Button
                title="Upgrade Now"
                onPress={() =>
                  router.push(
                    '/(module)/(a-root)/account-settings/subscriptions/plan'
                  )
                }
                variant="primary"
                className="mx-auto mt-2"
              />
            </View>

            {/* Change Plan & Upgrade To Pro */}
            <View className="mt-4 flex-row items-center justify-center gap-3">
              <Button
                title="Change Plan"
                onPress={() => {
                  router.push(
                    '/(module)/(a-root)/account-settings/subscriptions/plan'
                  );
                }}
                variant="outline"
                className="mt-2 items-center justify-center px-6"
              />
              <Button
                title="Upgrade To Pro"
                onPress={() => {
                  router.push(
                    '/(module)/(a-root)/account-settings/subscriptions/pro'
                  );
                }}
                variant="primary"
                className="mt-2 items-center justify-center px-6"
              />
            </View>

            {/* Status */}
            <View className="my-4 mt-4 flex-row items-center justify-center gap-3">
              <Text className="w-full rounded-md border border-stroke-border py-2 text-center font-roboto500 text-base text-stroke-border">
                No Active Subscription{' '}
              </Text>
            </View>

            <View className="h-[1px] w-full bg-[#094F811A]" />

            {/* Payment Methods */}
            <View className="my-4">
              <Text className="mb-2 font-roboto500 text-base text-title">
                Payment Methods
              </Text>
              <Text className="font-roboto400 text-xs text-description-text">
                Manage your payment methods and billing preferences
              </Text>
              <View className="mt-2 flex-row items-center justify-between gap-2">
                <View className="">
                  <Image
                    source={require('@/assets/images/paypal.png')}
                    resizeMode="cover"
                    style={{ width: 88, height: 88 }}
                  />
                  <Text className="ml-15 text-center font-roboto400 text-xs text-[#8E8E8E]">
                    Expires 9/2024
                  </Text>
                </View>

                <View>
                  <Feather name="trash-2" size={24} color="red" />
                </View>
              </View>
              <Button
                title={'+ Add payment method'}
                onPress={() => {
                  Toast.show({
                    type: 'error',
                    text1: 'This feature will be included in phase 2',
                  });
                }}
                variant="outline"
                fullWidth
                className="mt-4"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Subscription;
