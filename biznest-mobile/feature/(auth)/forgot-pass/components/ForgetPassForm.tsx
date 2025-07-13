import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { View } from "react-native";
import { z } from "zod";
import { ForgotPasswordForm } from "../types/type";
import { Controller, useForm } from "react-hook-form";
import Input from "@/components/ui/input";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export default function ForgetPassForm() {
  const {
    control,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <>
      <View className="mt-8 flex-1">
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
        {/* ✅ Submit button pinned at the bottom */}
      </View>
    </>
  );
}
