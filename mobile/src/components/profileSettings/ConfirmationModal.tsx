import React from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type ConfirmationModalProps = {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  confirmStyle?: 'danger' | 'primary'
  icon?: string
  iconColor?: string
  iconBackgroundColor?: string
}

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmStyle = 'primary',
  icon = 'alert-circle',
  iconColor = colors.white,
  iconBackgroundColor = colors.primary.DEFAULT,
}: ConfirmationModalProps) => {
  const getConfirmButtonStyle = () => {
    switch (confirmStyle) {
      case 'danger':
        return { backgroundColor: '#EF4444' }
      case 'primary':
      default:
        return { backgroundColor: colors.primary.DEFAULT }
    }
  }

  const getIconStyle = () => {
    if (confirmStyle === 'danger') {
      return {
        backgroundColor: '#FEE2E2',
        iconColor: '#DC2626',
      }
    }
    return {
      backgroundColor: iconBackgroundColor,
      iconColor: iconColor,
    }
  }

  const iconStyle = getIconStyle()

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center px-4`}>
        <View style={tw`bg-white rounded-lg p-6 w-full max-w-sm`}>
          <View style={tw`items-center mb-4`}>
            <View
              style={[
                tw`w-16 h-16 rounded-lg items-center justify-center mb-4`,
                { backgroundColor: iconStyle.backgroundColor },
              ]}>
              {icon === 'x' ? (
                <Feather name="x" size={32} color={iconStyle.iconColor} />
              ) : icon === 'log-out' ? (
                <View style={tw`items-center justify-center`}>
                  <Feather
                    name="log-out"
                    size={32}
                    color={iconStyle.iconColor}
                  />
                </View>
              ) : (
                <Feather
                  name={icon as any}
                  size={32}
                  color={iconStyle.iconColor}
                />
              )}
            </View>

            <Text style={tw`text-xl font-bold text-center mb-2`}>{title}</Text>
            <Text style={tw`text-gray-600 text-center leading-6`}>
              {message}
            </Text>
          </View>

          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`flex-1 border border-gray-300 rounded-md py-3 mr-2 items-center`}
              onPress={onClose}>
              <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`flex-1 rounded-md py-3 ml-2 items-center`,
                getConfirmButtonStyle(),
              ]}
              onPress={onConfirm}>
              <Text style={tw`text-white font-medium`}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
