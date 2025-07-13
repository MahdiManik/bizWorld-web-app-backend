import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { OnboardingCompleteModalProps } from "../types/types";

const OnboardingCompleteModal = ({
  visible,
  onClose,
  onBackToSignIn,
}: OnboardingCompleteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
          {/* Decorative Elements */}
          <View className="absolute top-12 left-8">
            <View className="w-3 h-3 bg-orange-500 rounded-full" />
          </View>

          <View className="absolute top-6 left-16">
            <View className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-800" />
          </View>

          <View className="absolute top-16 left-4">
            <Text className="text-red-500 text-lg">★</Text>
          </View>

          <View className="absolute top-8 right-8">
            <Text className="text-yellow-400 text-lg">★</Text>
          </View>

          <View className="absolute top-20 right-6">
            <View className="w-3 h-3 bg-amber-800 rounded-full" />
          </View>

          <View className="absolute top-24 right-12">
            <View className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent" />
          </View>

          <View className="absolute bottom-32 left-6">
            <View className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent" />
          </View>

          <View className="absolute bottom-28 left-12">
            <View className="w-2 h-2 rounded-full" />
          </View>

          {/* Main Content */}
          <View className="items-center mt-4">
            {/* Success Circle with Checkmark */}
            <View className="w-24 h-24 rounded-full items-center justify-center mb-6">
              <Feather name="check" size={32} color="white" />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Onboarding Complete!
            </Text>

            {/* Description */}
            <Text className="text-gray-600 text-center leading-6 mb-8 px-2">
              Thank you for completing your registration.{"\n"}
              Your account is pending admin approval.{"\n"}
              We&apos;ll notify you once it&apos;s activated.
            </Text>

            {/* Back to Sign In Button */}
            <TouchableOpacity
              className="rounded-lg py-4 px-8 w-full"
              onPress={onBackToSignIn}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-lg text-center">
                Back to Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OnboardingCompleteModal;
