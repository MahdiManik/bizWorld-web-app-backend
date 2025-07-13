import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useToast } from '@/utils/toast'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

export default function ChangePasswordScreen() {
  const router = useRouter()
  const toast = useToast()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    let isValid = true

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
      isValid = false
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long'
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        'New password must be different from current password'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleUpdate = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      toast.show('Password changed successfully', {
        type: 'success',
        placement: 'top',
        duration: 3000,
      })

      router.back()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update password'

      if (errorMessage.includes('Current password is incorrect')) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: 'Current password is incorrect',
        }))
      } else {
        toast.show(errorMessage, {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 text-lg font-medium mb-2`}>
            Current Password
          </Text>
          <View style={tw`relative`}>
            <TextInput
              style={[
                tw`border border-gray-300 rounded-md p-3 pr-12 bg-gray-50 text-lg`,
                errors.currentPassword ? tw`border-red-500` : '',
              ]}
              value={formData.currentPassword}
              onChangeText={(text: string) =>
                handleInputChange('currentPassword', text)
              }
              placeholder="Current Password"
              placeholderTextColor={colors.gray[700]}
              secureTextEntry={!showPasswords.current}
              textContentType="password"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={tw`absolute right-4 top-3`}
              onPress={() => togglePasswordVisibility('current')}>
              <Feather
                name={showPasswords.current ? 'eye' : 'eye-off'}
                size={24}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>
          {errors.currentPassword ? (
            <Text style={tw`text-red-500 text-sm mt-1`}>
              {errors.currentPassword}
            </Text>
          ) : null}
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 text-lg font-medium mb-2`}>
            New Password
          </Text>
          <View style={tw`relative`}>
            <TextInput
              style={[
                tw`border border-gray-300 rounded-md p-3 pr-12 bg-gray-50 text-lg`,
                errors.newPassword ? tw`border-red-500` : '',
              ]}
              value={formData.newPassword}
              onChangeText={(text: string) =>
                handleInputChange('newPassword', text)
              }
              placeholder="New Password"
              placeholderTextColor={colors.gray[700]}
              secureTextEntry={!showPasswords.new}
              textContentType="newPassword"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={tw`absolute right-4 top-3`}
              onPress={() => togglePasswordVisibility('new')}>
              <Feather
                name={showPasswords.new ? 'eye' : 'eye-off'}
                size={24}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword ? (
            <Text style={tw`text-red-500 text-sm mt-1`}>
              {errors.newPassword}
            </Text>
          ) : (
            <Text style={tw`text-gray-500 text-sm mt-2`}>
              Password must be at least 8 characters long
            </Text>
          )}
        </View>

        <View style={tw`mb-8`}>
          <Text style={tw`text-gray-700 text-lg font-medium mb-2`}>
            Confirm New Password
          </Text>
          <View style={tw`relative`}>
            <TextInput
              style={[
                tw`border border-gray-300 rounded-md p-3 pr-12 bg-gray-50 text-lg`,
                errors.confirmPassword ? tw`border-red-500` : '',
              ]}
              value={formData.confirmPassword}
              onChangeText={(text: string) =>
                handleInputChange('confirmPassword', text)
              }
              placeholder="Confirm New Password"
              placeholderTextColor={colors.gray[700]}
              secureTextEntry={!showPasswords.confirm}
              textContentType="newPassword"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={tw`absolute right-4 top-3`}
              onPress={() => togglePasswordVisibility('confirm')}>
              <Feather
                name={showPasswords.confirm ? 'eye' : 'eye-off'}
                size={24}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={tw`text-red-500 text-sm mt-1`}>
              {errors.confirmPassword}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <View style={tw`p-4 flex-row`}>
        <TouchableOpacity
          style={tw`flex-1 border border-gray-300 rounded-md py-2 mr-2 items-center`}
          onPress={handleCancel}
          disabled={isLoading}>
          <Text style={tw`text-gray-700 font-medium text-lg`}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`flex-1 rounded-md py-2 ml-2 items-center`,
            isLoading
              ? tw`bg-gray-400`
              : { backgroundColor: colors.primary.DEFAULT },
          ]}
          onPress={handleUpdate}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white font-medium text-lg`}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}
