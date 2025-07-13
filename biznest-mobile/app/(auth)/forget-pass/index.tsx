import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { HeaderImage } from "@/feature/(auth)/login/components/HeaderImage";
import Button from "@/components/ui/button";
import ForgetPassForm from "@/feature/(auth)/forgot-pass/components/ForgetPassForm";
import { ForgotPasswordForm } from "@/feature/(auth)/forgot-pass/types/type";
import { useForm } from "react-hook-form";

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const { handleSubmit } = useForm<ForgotPasswordForm>({});

  const onSubmit = async (data: ForgotPasswordForm) => {
    // Reset state
    console.log(data);
    try {
      setTimeout(() => {
        router.push(`/(auth)/otp-verify`);
      }, 2000);
    } catch (error) {
      // Handle specific error
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView className="flex-grow  pt-4">
        <View>
          {/* Top section with image */}
          <HeaderImage />

          {/* Middle section with content */}
          <View className="flex-1 justify-center">
            <View className="mb-6 mt-2">
              <Button
                title="Back"
                className="flex-row items-center text-link"
                onPress={() => router.replace("/login")}
                variant="ghost"
                icon={
                  <Feather
                    name="chevron-left"
                    size={20}
                    className="text-link"
                  />
                }
              />
            </View>

            <Text className="text-3xl font-bold text-primary mb-2">
              Forgot Password
            </Text>
            <Text className="text-gray-600 mb-6">
              Enter your email address and we&apos;ll send you a code to reset
              your password
            </Text>
          </View>
        </View>
        <ForgetPassForm />
      </ScrollView>
      <View className="mb-8">
        <Button
          title="Submit"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          fullWidth
          size="large"
        />
      </View>
    </SafeAreaView>
  );
}
