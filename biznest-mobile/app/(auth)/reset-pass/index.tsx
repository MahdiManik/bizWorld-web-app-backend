"use client";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HeaderImage } from "@/feature/(auth)/login/components/HeaderImage";
import Button from "@/components/ui/button";
import ResetPassForm, {
  passwordSchema,
} from "@/feature/(auth)/reset-pass/components/ResetPassForm";

type ResetPasswordFormData = z.infer<typeof passwordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();

  // Initialize React Hook Form
  const { handleSubmit } = useForm<ResetPasswordFormData>({});

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView className="flex-grow  pt-4 justify-between">
        <View>
          {/* Top section with image */}
          <HeaderImage />
          {/* Middle section with content */}
          <View className="flex-1 justify-center">
            <View className="mb-6 mt-2">
              <Button
                title="Back"
                className="flex-row items-center text-link"
                onPress={() => router.replace("/(auth)/otp-verify")}
                icon={<Feather name="chevron-left" size={20} color="#007AFF" />}
                variant="ghost"
              />
            </View>

            <Text className="text-3xl font-bold text-primary mb-2">
              Reset Password
            </Text>
            <Text className="text-gray-600 mb-6">
              Create a new password for your account
            </Text>
            <ResetPassForm />
          </View>
        </View>

        {/* Bottom section with button */}
      </ScrollView>
      <View className="mb-12">
        <Button
          title="Reset Password"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          fullWidth
          size="large"
        />
      </View>
    </SafeAreaView>
  );
}
