import { View } from "react-native";
import React from "react";
import LoginForm from "@/feature/(auth)/login/components/LoginForm";
import { HeaderImage } from "@/feature/(auth)/login/components/HeaderImage";
import { Text } from "@/components/ui/text";

const Login = () => {
  return (
    <View className="flex-1 bg-white px-6 font-roboto700">
      <View className="flex-1">
        <View className="pt-4">
          <HeaderImage size="large" />
          <View className="mb-6">
            <Text className="text-4xl font-bold text-primay mb-2">Welcome</Text>
            <Text className="text-primary-50 text-sm">
              Elevate your career with our all-in-one business guide and
              networking app.
            </Text>
          </View>
        </View>

        <View className="flex-1">
          <LoginForm />
        </View>
      </View>
    </View>
  );
};

export default Login;
