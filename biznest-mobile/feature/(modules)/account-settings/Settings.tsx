import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import SettingsItem from './SettingsItem';
import ProfileIcon from '@/assets/svgs/account-setting/ProfileIcon';
import BriefCaseIcon from '@/assets/svgs/account-setting/BriefCaseIcon';
import LockIcon from '@/assets/svgs/account-setting/LockIcon';
import NotiIcon from '@/assets/svgs/account-setting/NotiIcon';
import DeleteIcon from '@/assets/svgs/account-setting/DeleteIcon';
import ExitIcon from '@/assets/svgs/account-setting/ExitIcon';
import WalletIcon from '@/assets/svgs/account-setting/WalletIcon';
import ConsultantPersonIcon from '@/assets/svgs/account-setting/ConsultantPersonIcon';
import colors from '@/constants/colors';
import MessageSquareIcon from '@/assets/svgs/account-setting/MessageSquareIcon';
import CreditCardIcon from '@/assets/svgs/account-setting/CreditCardIcon';
import { router } from 'expo-router';
import { useGetMe } from '@/feature/(auth)/hooks/useAuth';
import dayjs from 'dayjs';
import { useGetUserSubscription } from './subscription/hooks/useSubscription';

const Settings = () => {
  const { data } = useGetMe();
  const user = data?.data;
  const consultStatus = data?.data?.consultantStatus;
  console.log('available', user?.consultAvailablity);
  const { data: subscription } = useGetUserSubscription(
    Number(user?.user_profile?.id)
  );

  const settingsItems = [
    {
      id: 'personal-info',
      title: 'Personal Info',
      icon: <ProfileIcon />,
      route: '/account-settings/personal-info',
    },
    {
      id: 'company-info',
      title: 'Company Info',
      icon: <BriefCaseIcon />,
      route: '/account-settings/company-info',
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      icon: <WalletIcon />,
      route: '/account-settings/subscriptions',
      badge: 'Premium',
    },
    {
      id: 'change-password',
      title: 'Change Password',
      icon: <LockIcon />,
      route: '/account-settings/change-password',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <NotiIcon />,
      route: '/account-settings/notification',
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      icon: <DeleteIcon />,
      textColor: 'text-red',
      route: '/delete-account',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <ExitIcon />,
      route: '/logout',
    },
  ];
  const consultantsItems = [
    {
      id: 'services',
      title: 'Services',
      icon: <ProfileIcon />,
      route: '/account-settings/services',
    },
    {
      id: 'auto-reply',
      title: 'Auto Reply',
      icon: <MessageSquareIcon />,
      route: '/account-settings/auto-reply',
    },
    {
      id: 'payment-setting',
      title: 'Payment Setting',
      icon: <CreditCardIcon />,
      route: '/account-settings/payment-settings',
    },
  ];

  return (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="items-center bg-white py-6">
        <View className="w-full flex-row items-start justify-center">
          <View className="relative mb-4">
            <Image
              source={{
                uri: user?.user_profile?.image?.url,
              }}
              className="h-36 w-36 rounded-full"
              resizeMode="cover"
            />
            <View className="absolute -bottom-2 -right-2 rounded-full border-4 border-white bg-gray-100 p-2">
              <Feather name="edit-3" size={18} color="black" />
            </View>
          </View>
          <View className="absolute right-0 top-0 mb-3">
            {subscription?.data[0]?.subscription?.planType.toLowerCase() !==
            'Free'.toLowerCase() ? (
              <View className="rounded-full bg-gradient-to-r from-[#FBCF47] to-[#F79800] px-3 py-1">
                <Text className="text-center text-xs font-medium text-[#78350F]">
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={16}
                    className="text-[#78350F]"
                  />{' '}
                  {subscription?.data[0]?.subscription?.planType || 'Free'}
                </Text>
              </View>
            ) : (
              <View className="rounded-full bg-badge px-3 py-1">
                <Text className="text-center text-xs font-medium text-link">
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={16}
                    className="text-link"
                  />{' '}
                  {subscription?.data[0]?.subscription?.planType || 'Free'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-2 items-center">
          <Text className="mb-1 text-xl font-bold text-gray-800">
            {user?.fullName}
          </Text>
          <Text className="text-center text-sm text-gray-600">
            {user?.email} | {user?.user_profile?.phonePrefix}{' '}
            {user?.user_profile?.phone}
          </Text>
        </View>
      </View>
      <View className="border border-[#eeeeee]" />

      {/* Settings Items */}
      <View className="my-2 bg-white">
        {settingsItems.map((item) => (
          <SettingsItem
            key={item.id}
            icon={item.icon}
            route={item.route}
            title={item.title}
            textColor={item.textColor}
          />
        ))}
      </View>
      <View className="border border-[#eeeeee]" />

      <View className="mb-4 rounded-lg border border-unselect bg-bd_tech_secondary p-4">
        {consultStatus === 'CONSULTANT' ? (
          <View className="flex-row items-start gap-2">
            <Feather name="check-circle" size={20} color={colors.primary} />
            <View className="flex-1 gap-2">
              <Text className="font-roboto600 text-sm text-primary">
                Verified Consultant
              </Text>
              <Text className="font-roboto400 text-xs text-description-text">
                Approved on{' '}
                {user?.actionDate
                  ? dayjs(user?.actionDate).format('MMM DD,YYYY')
                  : ''}
                . You now have access to consultant features.
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-3">
            <Text className="text-center font-roboto600 text-sm text-primary">
              Become a Verified Consultant
            </Text>
            <Text className="text-center font-roboto400 text-xs text-description-text">
              Share your expertise, connect with clients, and grow your business
              by becoming a verified consultant on our platform.
            </Text>
            {consultStatus === 'NONE' ? (
              <TouchableOpacity
                className="mx-auto flex w-[80%] flex-row items-center justify-center gap-2 rounded-md bg-primary p-2"
                onPress={() => router.push('/apply-consultant')}
              >
                <ConsultantPersonIcon />
                <Text className="text font-roboto700 text-sm text-white">
                  Apply as Consultant
                </Text>
              </TouchableOpacity>
            ) : consultStatus === 'PENDING' ? (
              <View className="flex-row items-start gap-4 rounded-lg border border-unselect bg-white p-4">
                <AntDesign
                  name="clockcircleo"
                  size={18}
                  color={colors.description.text}
                />
                <View className="flex-1 gap-2">
                  <Text className="font-roboto600 text-xs text-title">
                    Application Under Review
                  </Text>
                  <Text className="font-roboto400 text-xs text-description-text">
                    Our team is reviewing your application. This usually takes
                    1-3 working days.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>

      {consultStatus === 'CONSULTANT' ? (
        <View className="mt-4 gap-4">
          <View className="border border-[#eeeeee]" />
          <View className="mb-8 bg-white">
            {consultantsItems.map((item) => (
              <SettingsItem
                key={item.id}
                icon={item.icon}
                route={item.route}
                title={item.title}
              />
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default Settings;
