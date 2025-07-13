"use client";

import { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { Feather } from "@expo/vector-icons";
import { HeaderImage } from "@/feature/(auth)/login/components/HeaderImage";
import Button from "@/components/ui/button";
import { OTPInput } from "@/feature/(auth)/otp-verify/components/OtpInput";

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || undefined;
  const type = params.get("type") || "signup";

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      return;
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend OTP error:", error);
      //   setAuthError("Failed to resend code. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-1">
        {/* Top section with image */}
        <HeaderImage />
        {/* Middle section with content */}
        <View className="flex-1 justify-center mb-12">
          <View className="mb-6 mt-2">
            <Button
              title="Back"
              variant="ghost"
              icon={
                <Feather name="chevron-left" size={20} className="text-link" />
              }
              onPress={() => {
                console.log("Back button pressed");
                // First try regular back navigation
                try {
                  router.replace("/(auth)/forget-pass");
                } catch (e) {
                  console.error("Error using router.back():", e);
                  // Fallback: Navigate to sign-up screen directly
                  if (type === "reset") {
                    router.replace("/(auth)/forget-pass");
                  } else {
                    router.replace("/(auth)/register");
                  }
                }
              }}
            />
          </View>

          <Text className="text-xl font-bold text-primary mb-3">
            {type === "reset" ? "Password Reset" : "Enter Authentication Code"}
          </Text>
          <Text className="text-gray-600 mb-12">
            A four-digit PIN has been sent to your email ({email}). Input the
            code to validate your{" "}
            {type === "reset" ? "password reset" : "account creation"}.
          </Text>

          <OTPInput
            length={4}
            onComplete={setOtp}
            //   error={authError || undefined}
          />
        </View>
      </View>

      {/* Bottom section with button */}
      <View className="mt-8 mb-12">
        <Button
          size="large"
          fullWidth
          title="Verify otp"
          onPress={handleVerifyOTP}
          variant="primary"
          // disabled={isLoading || otp.length !== 4}
        />

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-primary">Did not recieve code?</Text>
          <Button
            title="Send again"
            onPress={handleResendOTP}
            //   disabled={!canResend || isLoading}
            className="py-2 px-4 rounded-lg flex-row items-center justify-center"
            variant="ghost"
            size="large"
          />
        </View>
        {!canResend && <Text className="text-primary">{timeLeft}s</Text>}
      </View>
    </SafeAreaView>
  );
}
