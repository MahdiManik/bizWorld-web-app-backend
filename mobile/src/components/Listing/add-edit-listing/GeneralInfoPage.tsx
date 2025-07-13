import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import tw from '@/lib/tailwind'
import { useFormContext, Controller } from 'react-hook-form'
import * as ImagePicker from 'expo-image-picker'
import { Feather } from '@expo/vector-icons'
import { getImageSource } from '@/utils/getImageSource'

import { Input } from '@/components/form/input'

interface GeneralInfoPageProps {
  isEditMode?: boolean
  disabledFields?: string[]
  onPickImage?: () => void
}

export const GeneralInfoPage = ({
  isEditMode = false,
  disabledFields = [],
  onPickImage,
}: GeneralInfoPageProps) => {
  // Get form methods from React Hook Form context
  const {
    control,
    formState: { errors },
  } = useFormContext()

  // Helper function to check if a field is disabled
  const isDisabled = (fieldName: string): boolean => {
    return disabledFields.includes(fieldName)
  }
  return (
    <ScrollView style={tw`flex-1 px-4`}>
      <Text style={tw`text-xl font-bold mt-4 mb-6`}>General Information</Text>
      <Controller
        control={control}
        name="image"
        render={({ field: { value, onChange } }) => (
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-800 font-medium mb-2`}>
              Thumbnail / Cover Image
            </Text>
            {value ? (
              <View style={tw`relative`}>
                <Image
                  source={getImageSource(value)}
                  style={tw`w-full h-48 rounded-lg`}
                  resizeMode="cover"
                  key={`image-${Date.now()}`} // Force re-render with a unique key
                />
                <TouchableOpacity
                  style={tw`absolute top-2 right-2 bg-white rounded-full p-2 shadow-md`}
                  onPress={() => {
                    if (onPickImage) {
                      onPickImage()
                    } else {
                      // Fallback to direct image picker if no callback provided
                      ;(async () => {
                        try {
                          const { status } =
                            await ImagePicker.requestMediaLibraryPermissionsAsync()
                          if (status !== 'granted') {
                            Alert.alert(
                              'Permission Required',
                              'Please allow access to your photo library'
                            )
                            return
                          }

                          const result =
                            await ImagePicker.launchImageLibraryAsync({
                              mediaTypes: ImagePicker.MediaTypeOptions.Images,
                              allowsEditing: true,
                              aspect: [16, 9],
                              quality: 0.7,
                            })

                          if (
                            !result.canceled &&
                            result.assets &&
                            result.assets[0]
                          ) {
                            onChange(result.assets[0].uri)
                          }
                        } catch (error) {
                          console.error('Error picking image:', error)
                        }
                      })()
                    }
                  }}>
                  <Feather name="edit-2" size={16} color="#0d4893" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={tw`border-2 border-dashed border-gray-300 rounded-lg h-48 items-center justify-center bg-gray-50`}
                onPress={() => {
                  if (onPickImage) {
                    onPickImage()
                  } else {
                    // Fallback to direct image picker if no callback provided
                    ;(async () => {
                      try {
                        const { status } =
                          await ImagePicker.requestMediaLibraryPermissionsAsync()
                        if (status !== 'granted') {
                          Alert.alert(
                            'Permission Required',
                            'Please allow access to your photo library'
                          )
                          return
                        }

                        const result =
                          await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [16, 9],
                            quality: 0.7,
                          })

                        if (
                          !result.canceled &&
                          result.assets &&
                          result.assets[0]
                        ) {
                          onChange(result.assets[0].uri)
                        }
                      } catch (error) {
                        console.error('Error picking image:', error)
                      }
                    })()
                  }
                }}>
                <Feather name="image" size={32} color="#9ca3af" />
                <Text style={tw`text-gray-500 mt-2`}>Upload Cover Image</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Listing Title"
            value={value}
            onChangeText={onChange}
            placeholder="Enter listing title"
          />
        )}
      />

      <Controller
        control={control}
        name="location"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Location / Country"
            value={value}
            onChangeText={onChange}
            placeholder="Enter company location"
            disabled={isDisabled('location')}
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Category"
            type="select"
            placeholder="Select category"
            selectedValue={value}
            options={[
              { value: 'MOBILE', label: 'Mobile' },
              { value: 'FINTECH', label: 'Fintech' },
              { value: 'ECOMMERCE', label: 'E-commerce' },
            ]}
            onSelect={onChange}
          />
        )}
      />

      {!isEditMode && (
        <Controller
          control={control}
          name="coverImage"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Thumbnail / Cover Image"
              type="file"
              value={value || undefined}
              onRightIconPress={() => {
                onChange('sample-image.jpg')
              }}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="visibility"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Visibility"
            type="radio"
            options={[
              { value: 'private', label: 'Private' },
              { value: 'public', label: 'Public' },
            ]}
            selectedValue={value}
            onSelect={onChange}
          />
        )}
      />

      <View style={tw`w-full px-0`}>
        <Text style={tw`text-xl font-bold mt-6 mb-6`}>
          Business Description
        </Text>

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Short Description"
              value={value}
              onChangeText={onChange}
              placeholder="Enter business description"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={tw`min-h-[150px] py-2 px-3 w-full`}
              containerStyle="w-full px-0 mx-0"
              disabled={isDisabled('description')}
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="companyName"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Company Name"
            value={value}
            onChangeText={onChange}
            placeholder="Enter company name"
            disabled={isDisabled('companyName')}
          />
        )}
      />

      <Controller
        control={control}
        name="industry"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Industry"
            type="select"
            placeholder="Select industry"
            selectedValue={value}
            options={[
              { value: 'technology', label: 'Technology' },
              { value: 'retail', label: 'Retail' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'finance', label: 'Finance' },
            ]}
            onRightIconPress={() => {}}
            onSelect={onChange}
            disabled={isDisabled('industry')}
          />
        )}
      />

      <Controller
        control={control}
        name="businessType"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Business Type"
            type="select"
            placeholder="Select business type"
            selectedValue={value}
            options={[
              { value: 'SMALL_BUSINESS', label: 'Small Business' },
              { value: 'STARTUP', label: 'Startup' },
              { value: 'ENTERPRISE', label: 'Enterprise' },
            ]}
            onRightIconPress={() => {}}
            onSelect={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="established"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Established"
            value={value}
            onChangeText={onChange}
            placeholder="eg.2018"
            keyboardType="numeric"
            disabled={isDisabled('established')}
          />
        )}
      />

      <Controller
        control={control}
        name="employees"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Number of Employees"
            type="select"
            placeholder="Select employee count"
            selectedValue={value}
            options={[
              { value: '1-5', label: '1-5' },
              { value: '6-15', label: '6-15' },
              { value: '15-30', label: '15-30' },
              { value: '31-50', label: '31-50' },
              { value: '50+', label: '50+' },
              { value: '150', label: '150' },
            ]}
            onRightIconPress={() => {}}
            onSelect={onChange}
            disabled={isDisabled('employees')}
          />
        )}
      />

      <Text style={tw`text-xl font-bold mt-6 mb-6`}>
        Investment Opportunity
      </Text>

      <Controller
        control={control}
        name="askingPrice"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Asking Price"
            prefix="$"
            value={value}
            onChangeText={(val) => onChange(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
          />
        )}
      />

      <Controller
        control={control}
        name="equityOffered"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Equity Offered"
            suffix="%"
            value={value}
            onChangeText={(val) => onChange(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
            disabled={isDisabled('equityOffered')}
          />
        )}
      />

      <Controller
        control={control}
        name="revenue"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Revenue (Annual)"
            prefix="$"
            value={value}
            onChangeText={(val) => onChange(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
          />
        )}
      />

      <Controller
        control={control}
        name="profitMargin"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Profit Margin"
            suffix="%"
            value={value}
            onChangeText={(val) => onChange(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
          />
        )}
      />

      <Controller
        control={control}
        name="growthRate"
        render={({ field: { value, onChange } }) => (
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-800 font-medium mb-1`}>Growth Rate</Text>
            <View
              style={tw`flex-row items-center border border-gray-300 rounded-md bg-white`}>
              <Text
                style={tw`px-3 py-3 border-r border-gray-300 text-gray-800 font-medium`}>
                YoY
              </Text>
              <TextInput
                style={tw`flex-1 p-3 text-gray-800`}
                value={value}
                onChangeText={(val: string) =>
                  onChange(val.replace(/[^0-9.]/g, ''))
                }
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              <Text
                style={tw`px-3 py-3 border-l border-gray-300 text-gray-800 font-medium`}>
                %
              </Text>
            </View>
          </View>
        )}
      />

      <View style={tw`h-24`} />
    </ScrollView>
  )
}
