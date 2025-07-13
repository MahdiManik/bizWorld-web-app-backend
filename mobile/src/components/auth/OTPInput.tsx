/* eslint-disable no-unused-vars */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  TextInput,
  Text,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native'
import tw from '@/lib/tailwind'

type OTPInputProps = {
  length?: number
  onComplete: (otp: string) => void
  error?: string
}

export const OTPInput = ({ length = 4, onComplete, error }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  // Properly type the ref for TextInput elements using the correct type
  const inputRefs = useRef<Array<React.RefObject<typeof TextInput>>>([])

  useEffect(() => {
    // Initialize refs array with proper React refs
    inputRefs.current = Array(length)
      .fill(null)
      .map(() => React.createRef<typeof TextInput>())
  }, [length])

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedText = text.split('').slice(0, length)
      const newOtp = [...otp]

      pastedText.forEach((char, i) => {
        if (index + i < length) {
          newOtp[index + i] = char
        }
      })

      setOtp(newOtp)

      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + pastedText.length, length - 1)
      inputRefs.current[nextIndex]?.current?.focus()

      if (newOtp.every((digit) => digit !== '')) {
        onComplete(newOtp.join(''))
      }

      return
    }

    // Handle single character input
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    // Auto-focus next input if current input is filled
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.current?.focus()
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      inputRefs.current[index - 1]?.current?.focus()
    }
  }

  return (
    <View style={tw`mb-4`}>
      <View style={tw`flex-row justify-between`}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={inputRefs.current[index]}
              style={[
                tw`border text-center text-lg font-bold w-14 h-14 rounded-lg`,
                error ? tw`border-red-500` : tw`border-gray-300`,
              ]}
              maxLength={1}
              keyboardType="numeric"
              value={otp[index]}
              onChangeText={(text: string) => handleChange(text, index)}
              onKeyPress={(
                e: NativeSyntheticEvent<TextInputKeyPressEventData>
              ) => handleKeyPress(e, index)}
            />
          ))}
      </View>
      {error && <Text style={tw`text-red-500 text-xs mt-1`}>{error}</Text>}
    </View>
  )
}
