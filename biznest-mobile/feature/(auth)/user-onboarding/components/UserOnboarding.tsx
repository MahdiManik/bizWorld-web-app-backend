import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import UserOnboardingForm from './UserOnboardingForm';

const UserOnboarding = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="px-10"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="h-full w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex h-full w-full gap-3 pt-6">
            <Text className="text-[#2D2D2D} text-center font-roboto600 text-base">
              User Onboarding
            </Text>
            <Text className="text-center font-roboto400 text-sm text-[#5C5C5C]">
              Before you embark on your journey, you can fill in your profile
              particulars so that we can ensure the content that you come across
              will be more relevant to you!
            </Text>

            <UserOnboardingForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserOnboarding;
