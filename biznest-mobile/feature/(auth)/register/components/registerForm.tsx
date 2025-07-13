import { View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";

const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof signupSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    console.log(data);
    router.replace("/register-verify-otp");
  };

  return (
    <View className="flex-1">
      <View className="flex-1">
        {/* Form Fields */}
        <View className="space-y-4">
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                error={errors.fullName?.message}
              />
            )}
          />

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
        </View>
      </View>

      {/* Bottom Section - Fixed at bottom */}
      <View className="mt-8 mb-6">
        {/* Login button */}
        <Button
          title="Sign up"
          onPress={handleSubmit(handleRegister)}
          variant="primary"
          size="large"
          fullWidth
          className="mb-4"
        />
      </View>
    </View>
  );
};

export default RegisterForm;
