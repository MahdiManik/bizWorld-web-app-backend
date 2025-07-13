import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import tw from '@/lib/tailwind'
import {
  mockUserProfile,
  industryOptions,
  companyStatusOptions,
} from 'data/profileData'
import { colors } from '@/constants/colors'

export default function EditCompanyInfoScreen() {
  const router = useRouter()
  const initialProfile = mockUserProfile
  const { companyInfo } = initialProfile[0]

  const [formData, setFormData] = useState({
    name: companyInfo.name,
    logo: companyInfo.logo,
    status: companyInfo.status,
    industry: companyInfo.industry,
    location: companyInfo.location,
    size: companyInfo.size,
    revenue: companyInfo.revenue,
    description: companyInfo.description,
    businessType: 'SMALL_BUSINESS', // Add businessType field with default
    documents: [...companyInfo.documents],
  })

  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePickLogo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'You need to grant camera roll permissions to change your company logo.'
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleUpdateField('logo', result.assets[0].uri)
    }
  }

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        // Add null checks for all asset properties
        if (asset && asset.name && asset.size !== undefined && asset.uri) {
          const newDoc = {
            name: asset.name,
            size: `${Math.round(asset.size / 1024)} kb`,
            url: asset.uri,
          }

          handleUpdateField('documents', [newDoc])
        }
      }
    } catch (error) {
      console.log('Error picking document:', error)
    }
  }

  const formatRevenueInput = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, '')
    return numericValue
  }

  const formatRevenueDisplay = (value: string) => {
    if (!value) return ''
    const numericValue = parseFloat(value)
    if (isNaN(numericValue)) return value
    return numericValue.toLocaleString()
  }

  const handleSave = () => {
    const requiredFields = ['name', 'industry', 'location', 'size', 'revenue', 'businessType']
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    )

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields marked with *'
      )
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)

      const updatedProfile = {
        ...initialProfile,
        companyInfo: {
          ...initialProfile[0].companyInfo,
          ...formData,
        },
      }

      router.push('/account-settings/company-info')
    }, 1000)
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`items-center mb-6`}>
          <View style={tw`relative`}>
            <Image
              source={{ uri: formData.logo }}
              style={tw`w-24 h-24 rounded-full`}
            />
            <TouchableOpacity
              style={tw`absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-200`}
              onPress={handlePickLogo}>
              <Feather name="edit-2" size={16} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Company Name <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white`}
            value={formData.name}
            onChangeText={(text: string) => handleUpdateField('name', text)}
            placeholder="Company Name"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-2`}>Company Status</Text>
          <View style={tw`flex-row`}>
            {companyStatusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={tw`flex-row items-center mr-6`}
                onPress={() => handleUpdateField('status', option.value)}>
                <View
                  style={tw`h-5 w-5 rounded-full border border-[${colors.primary.DEFAULT}] mr-2 items-center justify-center`}>
                  {formData.status === option.value && (
                    <View
                      style={tw`h-3 w-3 rounded-full bg-[${colors.primary.DEFAULT}]`}
                    />
                  )}
                </View>
                <Text style={tw`text-gray-800`}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Industry Specialization <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center`}
            onPress={() => setShowIndustryDropdown(!showIndustryDropdown)}>
            <Text style={tw`text-gray-800`}>
              {formData.industry || 'Select Industry'}
            </Text>
            <Feather name="chevron-down" size={20} color={colors.gray[500]} />
          </TouchableOpacity>

          {showIndustryDropdown && (
            <View
              style={tw`border border-gray-300 rounded-md mt-1 max-h-40 bg-white`}>
              <ScrollView>
                {industryOptions.map((industry, index) => (
                  <TouchableOpacity
                    key={index}
                    style={tw`p-3 border-b border-gray-100 ${formData.industry === industry ? 'bg-gray-100' : ''}`}
                    onPress={() => {
                      handleUpdateField('industry', industry)
                      setShowIndustryDropdown(false)
                    }}>
                    <Text
                      style={tw`${formData.industry === industry ? 'font-bold' : ''}`}>
                      {industry}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Location <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white`}
            value={formData.location}
            onChangeText={(text: string) => handleUpdateField('location', text)}
            placeholder="e.g. London, UK"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Company Size <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white`}
            value={formData.size}
            onChangeText={(text: string) =>
              handleUpdateField('size', text.replace(/[^0-9]/g, ''))
            }
            placeholder="e.g. 120"
            keyboardType="numeric"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Business Type <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center`}
            onPress={() => setShowBusinessTypeDropdown(!showBusinessTypeDropdown)}>
            <Text style={tw`text-gray-800`}>
              {formData.businessType === 'SMALL_BUSINESS' ? 'Small Business' :
               formData.businessType === 'STARTUP' ? 'Startup' :
               formData.businessType === 'ENTERPRISE' ? 'Enterprise' :
               'Select Business Type'}
            </Text>
            <Feather name="chevron-down" size={20} color={colors.gray[500]} />
          </TouchableOpacity>

          {showBusinessTypeDropdown && (
            <View style={tw`border border-gray-300 rounded-md mt-1 bg-white`}>
              {[
                { label: 'Small Business', value: 'SMALL_BUSINESS' },
                { label: 'Startup', value: 'STARTUP' },
                { label: 'Enterprise', value: 'ENTERPRISE' }
              ].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={tw`p-3 border-b border-gray-100 ${formData.businessType === option.value ? 'bg-gray-100' : ''}`}
                  onPress={() => {
                    handleUpdateField('businessType', option.value)
                    setShowBusinessTypeDropdown(false)
                  }}>
                  <Text style={tw`${formData.businessType === option.value ? 'font-bold' : ''}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Revenue <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <View
            style={tw`flex-row items-center border border-gray-300 rounded-md bg-white`}>
            <Text
              style={tw`px-3 py-3 border-r border-gray-300 text-gray-800 font-medium`}>
              $
            </Text>
            <TextInput
              style={tw`flex-1 p-3 text-gray-800`}
              value={formatRevenueDisplay(formData.revenue)}
              onChangeText={(text: string) =>
                handleUpdateField('revenue', formatRevenueInput(text))
              }
              placeholder="2,000,000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>Upload Document</Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`bg-gray-100 rounded-l-md py-3 px-4`}
              onPress={handlePickDocument}>
              <Text style={tw`text-gray-700`}>Choose File</Text>
            </TouchableOpacity>
            <View
              style={tw`flex-1 border border-gray-300 border-l-0 rounded-r-md p-3 bg-white`}>
              <Text style={tw`text-gray-500 truncate`}>
                {formData.documents.length > 0
                  ? formData.documents[0].name
                  : 'No file chosen'}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 mb-1`}>Description</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white min-h-[120px]`}
            value={formData.description}
            onChangeText={(text: string) =>
              handleUpdateField('description', text)
            }
            placeholder="Describe your company, its mission, and what makes it unique..."
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={tw`flex-row justify-between mb-8`}>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-md py-3 px-6 flex-1 mr-2 items-center`}
            onPress={() => router.back()}
            disabled={isLoading}>
            <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tw`rounded-md py-3 px-6 flex-1 ml-2 items-center`, { backgroundColor: colors.primary.DEFAULT }]}
            onPress={handleSave}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={tw`text-white font-medium`}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
