import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginFormData) => {
    console.log(data);
    router.replace("/");
  };

  return (
    <View className="flex-1">
      <View className="flex-1">
        {/* Form Fields */}
        <View className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          {/* Forgot Password - right aligned */}
          <View className="flex-row justify-end w-full">
            <Button
              title="Forgot Password?"
              onPress={() => router.push("/forget-pass")}
              variant="text"
              textClassName="text-primary"
            />
          </View>
        </View>
      </View>

      {/* Bottom Section - Fixed at bottom */}
      <View className="mt-8 mb-6">
        {/* Login button */}
        <Button
          title="Login"
          onPress={handleSubmit(handleLogin)}
          variant="primary"
          size="large"
          fullWidth
          className="mb-4"
        />

        {/* Sign up link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign up here</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;
