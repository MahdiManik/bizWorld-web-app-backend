import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type MenuOption = {
  id: string
  title: string
  icon: string
  onPress: () => void
}

type MoreMenuModalProps = {
  visible: boolean
  onClose: () => void
  options: MenuOption[]
}

const { height: screenHeight } = Dimensions.get('window')

export const MoreMenuModal = ({
  visible,
  onClose,
  options,
}: MoreMenuModalProps) => {
  const fadeAnim = new Animated.Value(visible ? 1 : 0)
  const slideAnim = new Animated.Value(visible ? 0 : 50)

  if (visible) {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  } else {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}>
      <View style={tw`flex-1`}>
        <TouchableOpacity
          style={tw`flex-1`}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={{
            opacity: fadeAnim,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 68,
          }}>
          <BlurView
            intensity={25}
            tint="dark"
            style={tw`flex-1 bg-black bg-opacity-40`}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            position: 'absolute',
            bottom: 70,
            right: 0,
            left: 0,
          }}>
          <View style={tw`items-end pr-4`}>
            {options.map((option, index) => (
              <MenuOptionItem
                key={option.id}
                option={option}
                index={index}
                onPress={() => {
                  option.onPress()
                  onClose()
                }}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

type MenuOptionItemProps = {
  option: MenuOption
  index: number
  onPress: () => void
}

const MenuOptionItem = ({ option, index, onPress }: MenuOptionItemProps) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center mb-5 justify-end`}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={tw`text-white font-medium mr-3 text-lg`}>
        {option.title}
      </Text>
      <View
        style={tw`w-11 h-11 rounded-full bg-white items-center justify-center shadow-lg`}>
        <Feather
          name={option.icon as any}
          size={20}
          color={colors.primary.DEFAULT}
        />
      </View>
    </TouchableOpacity>
  )
}
