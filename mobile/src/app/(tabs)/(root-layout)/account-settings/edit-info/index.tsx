import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native'
// Custom alert implementation to work around TypeScript issues
const showAlert = (title: string, message: string) => {
  // Using the global Alert object which is available at runtime
  // even if TypeScript doesn't recognize it in the imports
  if (typeof global.alert === 'function') {
    global.alert(`${title}\n\n${message}`)
  } else {
    console.warn(title, message)
  }
}
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import tw from '@/lib/tailwind'
import {
  expertiseOptions,
  industryOptions,
  mockUserProfile,
} from 'data/profileData'
import { colors } from '@/constants/colors'

export default function EditPersonalInfoScreen() {
  const router = useRouter()
  const initialProfile = mockUserProfile[0]

  const [formData, setFormData] = useState({
    firstName: initialProfile.firstName,
    lastName: initialProfile.lastName,
    email: initialProfile.email,
    phoneNumber: initialProfile.phoneNumber.replace(/^\+\d+\s/, ''),
    whatsappNumber: initialProfile.whatsappNumber.replace(/^\+\d+\s/, ''),
    profileImage: initialProfile.profileImage,
    professionalHeadline: initialProfile.professionalHeadline,
    industrySpecialization: initialProfile.industrySpecialization,
    areasOfExpertise: [...initialProfile.areasOfExpertise],
    portfolioLink: initialProfile.portfolioLink,
    documents: [...initialProfile.documents],
    introduction: initialProfile.introduction,
  })

  const [countryCode, setCountryCode] = useState('SG')
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      showAlert(
        'Permission Required',
        'You need to grant camera roll permissions to change your profile picture.'
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      handleUpdateField('profileImage', result.assets[0].uri)
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
        const newDoc = {
          name: asset.name || 'Document',
          size: asset.size
            ? `${Math.round(asset.size / 1024)} kb`
            : 'Unknown size',
          url: asset.uri,
        }

        handleUpdateField('documents', [newDoc])
      }
    } catch (error) {
      console.log('Error picking document:', error)
    }
  }

  const handleAddExpertise = (expertise: string) => {
    if (!formData.areasOfExpertise.includes(expertise)) {
      handleUpdateField('areasOfExpertise', [
        ...formData.areasOfExpertise,
        expertise,
      ])
    }
    setShowExpertiseDropdown(false)
  }

  const handleRemoveExpertise = (expertise: string) => {
    handleUpdateField(
      'areasOfExpertise',
      formData.areasOfExpertise.filter((item) => item !== expertise)
    )
  }

  const handleSave = () => {
    const requiredFields = [
      'firstName',
      'email',
      'phoneNumber',
      'whatsappNumber',
      'professionalHeadline',
      'industrySpecialization',
      'portfolioLink',
    ]

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    )

    if (missingFields.length > 0) {
      showAlert(
        'Missing Information',
        'Please fill in all required fields marked with *'
      )
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)

      router.push('/account-settings/personal-info')
    }, 1000)
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`items-center mb-6`}>
          <View style={tw`relative`}>
            <Image
              source={{ uri: formData.profileImage }}
              style={tw`w-24 h-24 rounded-full`}
            />
            <TouchableOpacity
              style={tw`absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-200`}
              onPress={handlePickImage}>
              <Feather name="edit-2" size={16} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`flex-row mb-4`}>
          <View style={tw`flex-1 mr-2`}>
            <Text style={tw`text-gray-700 mb-1`}>
              First Name <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-md p-3 bg-white`}
              value={formData.firstName}
              onChangeText={(text: string) =>
                handleUpdateField('firstName', text)
              }
              placeholder="First Name"
            />
          </View>

          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`text-gray-700 mb-1`}>Last Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-md p-3 bg-white`}
              value={formData.lastName}
              onChangeText={(text: string) =>
                handleUpdateField('lastName', text)
              }
              placeholder="Last Name"
            />
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Email <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white`}
            value={formData.email}
            onChangeText={(text: string) => handleUpdateField('email', text)}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Phone No <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`border border-gray-300 rounded-l-md p-3 bg-white flex-row items-center`}>
              <Image
                source={{ uri: 'https://flagcdn.com/w40/sg.png' }}
                style={tw`w-6 h-4 mr-1`}
              />
              <Feather name="chevron-down" size={16} color={colors.gray[500]} />
            </TouchableOpacity>
            <TextInput
              style={tw`border border-gray-300 border-l-0 rounded-r-md p-3 bg-white flex-1`}
              value={formData.phoneNumber}
              onChangeText={(text: string) =>
                handleUpdateField('phoneNumber', text)
              }
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            WhatsApp No <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`border border-gray-300 rounded-l-md p-3 bg-white flex-row items-center`}>
              <Image
                source={{ uri: 'https://flagcdn.com/w40/sg.png' }}
                style={tw`w-6 h-4 mr-1`}
              />
              <Feather name="chevron-down" size={16} color={colors.gray[500]} />
            </TouchableOpacity>
            <TextInput
              style={tw`border border-gray-300 border-l-0 rounded-r-md p-3 bg-white flex-1`}
              value={formData.whatsappNumber}
              onChangeText={(text: string) =>
                handleUpdateField('whatsappNumber', text)
              }
              placeholder="WhatsApp Number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Professional Headline <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white`}
            value={formData.professionalHeadline}
            onChangeText={(text: string) =>
              handleUpdateField('professionalHeadline', text)
            }
            placeholder="e.g. Senior UX Designer"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Industry Specialization <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center`}
            onPress={() => setShowIndustryDropdown(!showIndustryDropdown)}>
            <Text style={tw`text-gray-800`}>
              {formData.industrySpecialization || 'Select Industry'}
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
                    style={tw`p-3 border-b border-gray-100 ${formData.industrySpecialization === industry ? 'bg-gray-100' : ''}`}
                    onPress={() => {
                      handleUpdateField('industrySpecialization', industry)
                      setShowIndustryDropdown(false)
                    }}>
                    <Text
                      style={tw`${formData.industrySpecialization === industry ? 'font-bold' : ''}`}>
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
            Areas of Expertise <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center`}
            onPress={() => setShowExpertiseDropdown(!showExpertiseDropdown)}>
            <View style={tw`flex-row flex-wrap flex-1`}>
              {formData.areasOfExpertise.length > 0 ? (
                <>
                  {formData.areasOfExpertise
                    .slice(0, 1)
                    .map((expertise, index) => (
                      <View
                        key={index}
                        style={tw`bg-blue-100 rounded-md mr-1 mb-1 px-2 py-1 flex-row items-center`}>
                        <Text style={tw`text-blue-800 text-xs mr-1`}>
                          {expertise}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveExpertise(expertise)}>
                          <Feather
                            name="x"
                            size={14}
                            color={colors.primary[700]}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  {formData.areasOfExpertise.length > 1 && (
                    <View style={tw`bg-gray-200 rounded-md px-2 py-1`}>
                      <Text style={tw`text-gray-700 text-xs`}>
                        +{formData.areasOfExpertise.length - 1}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <Text style={tw`text-gray-500`}>Select Areas of Expertise</Text>
              )}
            </View>
            <Feather name="chevron-down" size={20} color={colors.gray[500]} />
          </TouchableOpacity>

          {showExpertiseDropdown && (
            <View
              style={tw`border border-gray-300 rounded-md mt-1 max-h-40 bg-white`}>
              <ScrollView>
                {expertiseOptions.map((expertise, index) => (
                  <TouchableOpacity
                    key={index}
                    style={tw`p-3 border-b border-gray-100 ${formData.areasOfExpertise.includes(expertise) ? 'bg-gray-100' : ''}`}
                    onPress={() => handleAddExpertise(expertise)}>
                    <Text
                      style={tw`${formData.areasOfExpertise.includes(expertise) ? 'font-bold' : ''}`}>
                      {expertise}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>
            Portfolio Link <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white`}
            value={formData.portfolioLink}
            onChangeText={(text: string) =>
              handleUpdateField('portfolioLink', text)
            }
            placeholder="e.g. yourportfolio.com"
            autoCapitalize="none"
          />
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
          <Text style={tw`text-gray-700 mb-1`}>Introduce Yourself</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 bg-white min-h-[120px]`}
            value={formData.introduction}
            onChangeText={(text: string) =>
              handleUpdateField('introduction', text)
            }
            placeholder="Tell us about yourself, your experience, and your expertise..."
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
              <Text style={tw`text-white font-medium`}>Loading...</Text>
            ) : (
              <Text style={tw`text-white font-medium`}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
