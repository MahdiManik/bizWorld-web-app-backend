import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { OTPInputProps } from "../types/type";

export const RegisterOTPInput = ({
  length = 4,
  onComplete,
  error,
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  // ✅ Fix: Use MutableRefObject and correct typing
  const inputRefs: React.MutableRefObject<React.RefObject<TextInput>[]> =
    useRef([]);

  if (inputRefs.current.length !== length) {
    inputRefs.current = Array.from(
      { length },
      () => React.createRef<TextInput>() as React.RefObject<TextInput>
    );
  }

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];

    if (text.length > 1) {
      const chars = text.split("").slice(0, length);
      chars.forEach((char, i) => {
        if (index + i < length) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[
        Math.min(index + chars.length, length - 1)
      ]?.current?.focus();
      if (newOtp.every((c) => c !== "")) onComplete(newOtp.join(""));
      return;
    }

    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }

    if (newOtp.every((c) => c !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  return (
    <View className="mb-6 w-full items-center">
      <View
        className="flex-row justify-between w-full max-w-[280px] mx-auto "
        style={{ gap: 8 }}
      >
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            className={`flex-1 max-w-[64px] rounded-lg border ${
              error
                ? "border-red-500"
                : otp[index]
                  ? "border-primary"
                  : "border-gray-200"
            } bg-white items-center justify-center`}
            style={{ height: 72, width: 64 }}
          >
            <TextInput
              ref={inputRefs.current[index]}
              className="w-full h-full text-2xl font-bold text-center text-gray-800 p-0 m-0"
              maxLength={1}
              keyboardType="number-pad"
              value={otp[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
              }}
              selectionColor="transparent"
              cursorColor="#007AFF"
              secureTextEntry
              selectTextOnFocus
            />
          </View>
        ))}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-3 text-center font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
