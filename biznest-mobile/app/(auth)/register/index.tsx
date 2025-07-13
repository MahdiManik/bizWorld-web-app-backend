import { View } from "react-native";
import React from "react";
import { HeaderImage } from "@/feature/(auth)/login/components/HeaderImage";
import { Link } from "expo-router";
import Button from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import RegisterForm from "@/feature/(auth)/register/components/registerForm";

const Register = () => {
  return (
    <View className="flex-1 bg-white px-6">
      <View className="flex-1">
        <View className="pt-4">
          <HeaderImage size="large" />
          <View className="mb-6">
            <Link href="/login" asChild>
              <Button
                variant="ghost"
                className="flex-row items-center justify-start p-0 text-link"
                icon={<Feather name="chevron-left" size={20} color="#007AFF" />}
                title="Return to Sign in"
                onPress={() => {}}
              />
            </Link>
          </View>
        </View>

        <View className="flex-1">
          <RegisterForm />
        </View>
      </View>
    </View>
  );
};

export default Register;
