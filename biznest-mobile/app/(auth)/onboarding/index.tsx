import ProfileForm from "@/feature/(auth)/onboarding/components/ProfileForm";
import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

// Define form data interface to avoid conflict with browser's FormData

export default function OnboardingStep1() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="items-center py-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            User Onboarding
          </Text>
          <Text className="text-gray-600 text-center leading-6">
            Before you embark on your journey, you can fill in your profile
            particulars so that we can ensure the content that you come across
            will be more relevant to you!
          </Text>
          <View className="flex-row mt-4">
            <View className="w-2 h-2 rounded-full mr-2" />
            <View className="w-2 h-2 rounded-full bg-gray-300" />
          </View>
          <ProfileForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
