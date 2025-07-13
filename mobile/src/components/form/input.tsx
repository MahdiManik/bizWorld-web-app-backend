/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

export type InputProps = TextInputProps & {
  label?: string
  error?: string
  prefix?: string
  suffix?: string
  rightIcon?: string
  onRightIconPress?: () => void
  containerStyle?: string
  labelStyle?: string
  inputStyle?: string
  errorStyle?: string
  type?: 'text' | 'select' | 'radio' | 'file' | 'tag' | 'image' | 'phone'
  options?: { value: string; label: string }[]
  selectedValue?: string
  onSelect?: (value: string) => void
  imageUrl?: string | number | null
  onEditImage?: () => void
  countryCode?: string
  onCountryCodeChange?: (code: string) => void
  required?: boolean
  disabled?: boolean
  disabledNote?: string
}

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
]

export const Input = ({
  label,
  error,
  prefix,
  suffix,
  rightIcon,
  onRightIconPress,
  containerStyle = '',
  labelStyle = '',
  inputStyle = '',
  errorStyle = '',
  type = 'text',
  options = [],
  selectedValue,
  onSelect,
  imageUrl,
  onEditImage,
  countryCode = '+1',
  onCountryCodeChange,
  required = false,
  disabled = false,
  disabledNote,
  ...props
}: InputProps) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const renderTextInput = () => (
    <View
      style={[
        tw`flex-row items-center border border-gray-300 rounded-lg ${disabled ? 'bg-gray-100' : 'bg-white'}`,
        isFocused && styles.focusedBorder,
        error && tw`border-red-500`,
      ]}>
      {prefix && (
        <View style={tw`px-3 py-3 ${suffix ? '' : 'border-r'} border-gray-300`}>
          <Text style={tw`text-gray-800 font-medium`}>{prefix}</Text>
        </View>
      )}
      <TextInput
        style={tw`flex-1 py-3.5 px-4 text-gray-800 ${disabled ? 'text-gray-500' : ''} ${inputStyle}`}
        placeholderTextColor="#9ca3af"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        {...props}
      />
      {suffix && (
        <View style={tw`px-3 py-3 ${prefix ? '' : 'border-l'} border-gray-300`}>
          <Text style={tw`text-gray-800 font-medium`}>{suffix}</Text>
        </View>
      )}
      {rightIcon && (
        <TouchableOpacity
          style={tw`px-3`}
          onPress={onRightIconPress}
          disabled={disabled}>
          <Feather
            name={rightIcon as any}
            size={20}
            color={disabled ? '#9ca3af' : '#4b5563'}
          />
        </TouchableOpacity>
      )}
    </View>
  )

  const renderPhoneInput = () => (
    <View
      style={[
        tw`flex-row items-center border border-gray-300 rounded-lg bg-white`,
        isFocused && styles.focusedBorder,
        error && tw`border-red-500`,
      ]}>
      <TouchableOpacity
        style={tw`px-3 py-3 border-r border-gray-300 flex-row items-center`}
        onPress={() => setShowCountryPicker(true)}>
        <Text style={tw`text-gray-800 font-medium mr-1`}>
          {countryCodes.find((c) => c.code === countryCode)?.flag || '🇺🇸'}
        </Text>
        <Feather name="chevron-down" size={16} color="#4b5563" />
      </TouchableOpacity>
      <TextInput
        style={tw`flex-1 py-3.5 px-4 text-gray-800 ${inputStyle}`}
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  )

  const renderSelectInput = () => (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        style={[
          tw`flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-4 ${disabled ? 'bg-gray-100' : 'bg-white'}`,
          error && tw`border-red-500`,
          showDropdown && tw`border-blue-500`,
        ]}
        onPress={() => !disabled && setShowDropdown(!showDropdown)}
        disabled={disabled}>
        <Text
          style={tw`text-${selectedValue ? (disabled ? 'gray-500' : 'gray-800') : 'gray-400'} flex-1`}>
          {selectedValue
            ? options.find((o) => o.value === selectedValue)?.label ||
              selectedValue
            : props.placeholder || 'Select an option'}
        </Text>
        <Feather
          name={showDropdown ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={disabled ? '#9ca3af' : showDropdown ? '#3b82f6' : '#6b7280'}
        />
      </TouchableOpacity>

      {/* Modal for dropdown options */}
      <Modal
        visible={showDropdown && !disabled}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity
          style={tw`flex-1 bg-black bg-opacity-30`}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}>
          <View style={tw`flex-1 justify-center items-center p-4`}>
            <View
              style={[
                tw`bg-white rounded-lg border border-gray-200 w-full max-w-sm`,
                {
                  maxHeight: 300,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 15,
                },
              ]}>
              <View style={tw`p-3 border-b border-gray-200`}>
                <Text style={tw`text-lg font-medium text-gray-800 text-center`}>
                  {label || 'Select Option'}
                </Text>
              </View>
              <ScrollView
                style={{ maxHeight: 200 }}
                showsVerticalScrollIndicator={false}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={tw`px-4 py-3 ${index < options.length - 1 ? 'border-b border-gray-100' : ''} ${selectedValue === option.value ? 'bg-blue-50' : ''}`}
                    onPress={() => {
                      onSelect && onSelect(option.value)
                      setShowDropdown(false)
                    }}>
                    <Text
                      style={tw`${selectedValue === option.value ? 'text-blue-600 font-medium' : 'text-gray-800'} text-center`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )

  const renderRadioInput = () => (
    <View style={tw`flex-row flex-wrap`}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={tw`flex-row items-center ${index > 0 ? 'ml-4' : ''}`}
          onPress={() => !disabled && onSelect && onSelect(option.value)}
          disabled={disabled}>
          <View
            style={tw`w-5 h-5 rounded-full border ${disabled ? 'border-gray-400' : 'border-gray-300'} mr-2 items-center justify-center ${selectedValue === option.value ? `border-${disabled ? 'gray-500' : 'blue-600'} border-2` : ''}`}>
            {selectedValue === option.value && (
              <View
                style={tw`w-2.5 h-2.5 rounded-full bg-${disabled ? 'gray-500' : 'blue-600'}`}
              />
            )}
          </View>
          <Text style={tw`text-${disabled ? 'gray-500' : 'gray-800'}`}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const handleFilePick = async () => {
    // If onRightIconPress is provided, only use that handler and skip built-in document picker
    // This prevents double document picker opening when used with useDocumentUpload
    if (onRightIconPress) {
      onRightIconPress()
      return
    }

    // Only run the built-in document picker if no external handler was provided
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        props.onChangeText && props.onChangeText(result.assets[0].name || '')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick a document')
      console.log('Document picker error:', error)
    }
  }

  const renderFileInput = () => (
    <View
      style={tw`border border-gray-300 rounded-lg overflow-hidden flex-row`}>
      <TouchableOpacity
        style={tw`bg-blue-50 py-3 px-4 border-r border-gray-300`}
        onPress={handleFilePick}>
        <Text style={tw`text-blue-600`}>Choose File</Text>
      </TouchableOpacity>
      <View style={tw`flex-1 p-3 bg-white justify-center`}>
        <Text style={tw`text-gray-500`} numberOfLines={1} ellipsizeMode="tail">
          {props.value
            ? String(props.value).split('/').pop()
            : 'No file chosen'}
        </Text>
      </View>
    </View>
  )

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'We need camera roll permission to upload images'
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (onEditImage) {
          props.onChangeText && props.onChangeText(result.assets[0].uri)
          onEditImage()
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick an image')
      console.log('Image picker error:', error)
    }
  }

  const renderImageInput = () => (
    <View style={tw`items-center`}>
      {imageUrl ? (
        <View style={tw`relative`}>
          <Image
            source={{ uri: imageUrl }}
            style={tw`w-24 h-24 rounded-full`}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={tw`absolute bottom-0 right-0 bg-gray-700 rounded-full p-2 items-center justify-center h-8 w-8`}
            onPress={handleImagePick}>
            <Feather name="edit-2" size={14} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={tw`w-24 h-24 rounded-full border border-gray-300 items-center justify-center bg-gray-100`}
          onPress={handleImagePick}>
          <Feather name="camera" size={28} color="#9ca3af" />
          <Text style={tw`text-gray-500 mt-2 text-xs`}>Add Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const CountryPickerModal = () => (
    <Modal
      visible={showCountryPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCountryPicker(false)}>
      <TouchableOpacity
        style={tw`flex-1 bg-black bg-opacity-50 justify-end`}
        activeOpacity={1}
        onPress={() => setShowCountryPicker(false)}>
        <View style={tw`bg-white rounded-t-lg max-h-96`}>
          <View style={tw`p-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-semibold text-center`}>
              Select Country
            </Text>
          </View>
          <FlatList
            data={countryCodes}
            keyExtractor={(item: any) => item.code}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={tw`p-4 border-b border-gray-100 flex-row items-center`}
                onPress={() => {
                  onCountryCodeChange && onCountryCodeChange(item.code)
                  setShowCountryPicker(false)
                }}>
                <Text style={tw`text-2xl mr-3`}>{item.flag}</Text>
                <Text style={tw`text-gray-800 flex-1`}>{item.country}</Text>
                <Text style={tw`text-gray-600`}>{item.code}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  )

  return (
    <View style={tw`mb-5 ${containerStyle}`}>
      {label && (
        <Text style={tw`text-gray-700 font-medium mb-2 ${labelStyle}`}>
          {label}
          {required && <Text style={tw`text-red-500`}>*</Text>}
        </Text>
      )}

      {type === 'text' && renderTextInput()}
      {type === 'phone' && renderPhoneInput()}
      {type === 'select' && renderSelectInput()}
      {type === 'radio' && renderRadioInput()}
      {type === 'file' && renderFileInput()}
      {type === 'image' && renderImageInput()}

      {error && (
        <Text style={tw`text-red-500 text-sm mt-1 ${errorStyle}`}>{error}</Text>
      )}

      {disabledNote && (
        <Text style={tw`text-gray-500 text-xs mt-1 italic`}>
          {disabledNote}
        </Text>
      )}

      <CountryPickerModal />
    </View>
  )
}

const styles = StyleSheet.create({
  focusedBorder: {
    borderColor: colors.primary.DEFAULT,
    borderWidth: 1.5,
  },
})
