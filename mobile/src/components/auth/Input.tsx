'use client'

import { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'

type InputProps = {
  label?: string
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  onBlur?: () => void
  secureTextEntry?: boolean
  error?: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible)

  return (
    <View style={tw`mb-4`}>
      {label && <Text style={tw`text-gray-700 mb-1 text-sm`}>{label}</Text>}
      <View style={tw`relative`}>
        <TextInput
          style={[
            tw`border rounded-lg px-4 py-3 text-base`,
            error ? tw`border-red-500` : tw`border-gray-300`,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={tw`absolute right-3 top-3`}
            onPress={togglePasswordVisibility}>
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={tw`text-red-500 text-xs mt-1`}>{error}</Text>}
    </View>
  )
}
