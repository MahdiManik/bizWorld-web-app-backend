/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import OnboardingCompleteModal from "@/feature/(auth)/onboarding-two/components/OnboardingCompleteModal";
import CompanyForm from "@/feature/(auth)/onboarding-two/components/CompanyForm";

export default function OnboardingStep2() {
  const router = useRouter();
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleBack = () => {
    router.replace("/onboarding");
  };

  const handleBackToSignIn = async () => {
    router.replace("/login");
    try {
    } catch (tokenError) {
      console.error("⚠️ Error clearing auth tokens:", tokenError);
      // Still try to navigate even if token removal fails
      router.replace("/login");
    }
  };

  return (
    <>
      {/* Onboarding Complete Modal - Positioned outside SafeAreaView for proper display */}
      <OnboardingCompleteModal
        visible={false}
        onClose={() => setShowCompleteModal(false)}
        onBackToSignIn={handleBackToSignIn}
      />

      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 px-4">
          <View className="items-center py-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              User Onboarding
            </Text>
            <Text className="text-gray-600 text-center leading-6">
              Before you proceed, please fill in your company details. This
              ensures that the content you encounter is tailored to your needs!
            </Text>
            <View className="flex-row mt-4">
              <TouchableOpacity onPress={handleBack}>
                <View className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
              </TouchableOpacity>
              <View className="w-2 h-2 rounded-full bg-gray-300" />
            </View>
            <CompanyForm />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
