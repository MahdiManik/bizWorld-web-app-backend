/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import { Controller, useForm } from 'react-hook-form'
import * as ImagePicker from 'expo-image-picker'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { Input } from '@/components/form/input'
import { useOnboarding, OnboardingData } from '@/contexts/OnboardingContexts'
import { expertiseOptions, industryOptions } from 'data/profileData'
import { Feather } from '@expo/vector-icons'
import { uploadFileToStrapi } from '@/lib/upload'
import { UserProfile } from '@/services/profile.service'

// Define form data interface to avoid conflict with browser's FormData
interface OnboardingStep1FormData {
  profileImage: string
  professionalHeadline: string
  industrySpecialization: string
  areasOfExpertise: string
  portfolioLink: string
  whatsappNumber: string
  whatsappCountryCode: string
  uploadedDocument: string
  introduction: string
}

export default function OnboardingStep1() {
  const router = useRouter()

  /* -------- context helpers -------- */
  const { data, updateMultipleFields, setCurrentStep } = useOnboarding()

  /* ---- local state for upload handling ---- */
  const [uploadLoading, setUploadLoading] = useState(false)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    data.uploadedDocument ? 'selected-document' : null
  )
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    data.profileImage ? 'selected-image' : null
  )
  // Keep local image URI for display (separate from file ID for submission)
  const [localImageUri, setLocalImageUri] = useState<string | null>(null)

  /* -------- react‑hook‑form -------- */
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingStep1FormData>({
    defaultValues: {
      profileImage: data.profileImage ? String(data.profileImage) : '',
      professionalHeadline: data.professionalHeadline || '',
      industrySpecialization: data.industrySpecialization || '',
      areasOfExpertise: Array.isArray(data.areasOfExpertise)
        ? data.areasOfExpertise.join(', ')
        : data.areasOfExpertise || '',
      portfolioLink: data.portfolioLink || '',
      whatsappNumber: data.whatsup || '',
      whatsappCountryCode: data.whatsappCountryCode || '',
      uploadedDocument: data.uploadedDocument
        ? String(data.uploadedDocument)
        : '',
      introduction: data.introduction || '',
    },
  })

  /* =================================================
     submit → store form values in context, go to step 2
  ================================================== */
  const onSubmit = (form: OnboardingStep1FormData) => {
    const contextData: Partial<OnboardingData> = {
      // Copy text fields directly
      professionalHeadline: form.professionalHeadline,
      industrySpecialization: form.industrySpecialization,
      areasOfExpertise: form.areasOfExpertise
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      portfolioLink: form.portfolioLink,
      introduction: form.introduction,
      whatsup: form.whatsappNumber,

      // Convert string file IDs to numbers (Strapi file IDs)
      profileImage: form.profileImage
        ? typeof form.profileImage === 'string'
          ? parseInt(form.profileImage, 10)
          : form.profileImage
        : null,
      uploadedDocument: form.uploadedDocument
        ? typeof form.uploadedDocument === 'string'
          ? parseInt(form.uploadedDocument, 10)
          : form.uploadedDocument
        : null,
    }

    updateMultipleFields(contextData)
    setCurrentStep(2)
    router.replace('/onboarding-two')
  }

  /* ------------ document upload ------------ */
  const uploadDocument = async (onChange: (id: string) => void) => {
    try {
      setUploadLoading(true)
      console.log('🚀 Starting document upload...')

      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      })

      if (res.canceled) {
        console.log('📋 Document picker canceled')
        return
      }

      const asset = res.assets?.[0]
      if (!asset) {
        console.log('❌ No asset found')
        return
      }

      console.log('📄 Selected document:', {
        name: asset.name,
        size: asset.size,
        type: asset.mimeType,
        uri: asset.uri,
      })

      // Prepare file for upload - let uploadFileToStrapi handle platform differences
      let fileToSend: File | { uri: string; name: string; type: string }

      if (Platform.OS === 'web') {
        const blob = await fetch(asset.uri).then((r) => r.blob())
        fileToSend = new File([blob], asset.name, {
          type: asset.mimeType || 'application/pdf',
        })
      } else {
        fileToSend = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/pdf',
        }
      }

      console.log('⬆️ Uploading file to Strapi...')
      const uploaded = await uploadFileToStrapi(fileToSend, 'files') // Explicitly use 'files'

      console.log('✅ Upload successful:', uploaded)
      const fileId = uploaded?.id

      if (!fileId) {
        throw new Error('No file ID returned from upload')
      }

      setSelectedFileName(asset.name)
      onChange(String(fileId)) // RHF field expects string
      updateMultipleFields({ uploadedDocument: fileId }) // context expects number

      console.log('🎉 Document upload completed:', {
        fileId,
        fileName: asset.name,
      })
    } catch (err) {
      console.error('❌ Document upload failed:', err)
      // You might want to show a toast or alert here
    } finally {
      setUploadLoading(false)
    }
  }

  const clearFile = (onChange: (value: undefined) => void) => {
    setSelectedFileName(null)
    onChange(undefined)
    updateMultipleFields({ uploadedDocument: undefined })
  }

  /* ------------ image upload ------------ */
  const uploadImage = async (onChange: (value: string) => void) => {
    // Prevent double uploads
    if (imageUploadLoading) {
      console.log('🚫 Upload already in progress, skipping...')
      return
    }

    try {
      setImageUploadLoading(true)
      console.log('📸 Starting image picker...')

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (result.canceled) {
        console.log('📋 Image picker canceled')
        return
      }

      const asset = result.assets?.[0]
      if (!asset) {
        console.log('❌ No image asset found')
        return
      }

      console.log('🖼️ Selected image:', {
        fileName: asset.fileName,
        uri: asset.uri,
        type: asset.type,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      })

      // Store local URI for immediate display
      setLocalImageUri(asset.uri)
      setSelectedImageName(asset.fileName || 'profile-image')

      console.log('⬆️ Starting image upload to Strapi...')

      // Upload to Strapi using the working uploadFileToStrapi function
      const uploadedFile = await uploadFileToStrapi(
        {
          uri: asset.uri,
          name: asset.fileName || 'profile-image.jpg',
          type: asset.type || 'image/jpeg',
        },
        'files'
      ) // Explicitly specify 'files' field

      console.log('✅ Image upload successful:', uploadedFile)

      const fileId = uploadedFile?.id
      if (!fileId) {
        throw new Error('No file ID returned from image upload')
      }

      // Store file ID in form and context (for backend submission)
      onChange(fileId.toString()) // RHF field expects string
      updateMultipleFields({ profileImage: fileId }) // context expects number

      console.log('🎉 Image upload completed:', {
        fileId,
        fileName: asset.fileName,
      })
    } catch (error) {
      console.error('❌ Image upload failed:', error)

      // Clear local URI and state on error
      setLocalImageUri(null)
      setSelectedImageName(null)

      // Clear form values on error
      onChange('')
      updateMultipleFields({ profileImage: undefined })

      // You might want to show a toast notification here
      // toast.error('Failed to upload image. Please try again.')
    } finally {
      console.log('🏁 Image upload process finished')
      setImageUploadLoading(false)
    }
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`items-center py-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            User Onboarding
          </Text>
          <Text style={tw`text-gray-600 text-center leading-6`}>
            Before you embark on your journey, you can fill in your profile
            particulars so that we can ensure the content that you come across
            will be more relevant to you!
          </Text>

          <View style={tw`flex-row mt-4`}>
            <View
              style={[
                tw`w-2 h-2 rounded-full mr-2`,
                { backgroundColor: colors.primary.DEFAULT },
              ]}
            />
            <View style={tw`w-2 h-2 rounded-full bg-gray-300`} />
          </View>
        </View>

        <Controller
          control={control}
          name="profileImage"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                type="image"
                imageUrl={
                  localImageUri ||
                  (value && value !== '[object Object]' ? value : undefined)
                }
                onEditImage={() => uploadImage(onChange)}
                containerStyle="items-center mb-6"
              />
              {imageUploadLoading && (
                <ActivityIndicator
                  style={tw`absolute right-3 top-12`}
                  size="small"
                  color={colors.primary.DEFAULT}
                />
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="professionalHeadline"
          rules={{ required: 'Professional Headline is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Professional Headline"
              placeholder="Financial Advisor"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="industrySpecialization"
          rules={{ required: 'Industry Specialization is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Industry Specialization"
              type="select"
              placeholder="Finance"
              options={industryOptions}
              selectedValue={value}
              onSelect={onChange}
              error={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="areasOfExpertise"
          rules={{ required: 'Areas of Expertise is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Areas of Expertise"
              type="select"
              placeholder="Select expertise"
              options={expertiseOptions}
              selectedValue={value}
              onSelect={onChange}
              error={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="portfolioLink"
          rules={{
            required: 'Portfolio Link is required',
            pattern: {
              value: /^(http|https):\/\/[^ "]+$/,
              message:
                'Please enter a valid URL starting with http:// or https://',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Portfolio Link"
              placeholder="https://myportfolio.com"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="whatsappNumber"
          rules={{
            required: 'WhatsApp Number is required',
            pattern: {
              value: /^\d+$/,
              message: 'Please enter a valid number (digits only)',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="WhatsApp No"
              type="phone"
              placeholder="Phone No (digits only)"
              value={value}
              onChangeText={onChange}
              countryCode={data.whatsappCountryCode}
              onCountryCodeChange={(code) =>
                updateMultipleFields({ whatsappCountryCode: code })
              }
              error={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <View>
              <Input
                label="Upload Document"
                type="file"
                value={
                  selectedFileName || (typeof value === 'string' ? value : '')
                }
                onRightIconPress={
                  !uploadLoading
                    ? selectedFileName
                      ? () => clearFile(onChange)
                      : () => uploadDocument(onChange)
                    : undefined
                }
                rightIcon={selectedFileName ? 'x-circle' : 'paperclip'}
              />
              {uploadLoading && (
                <ActivityIndicator
                  style={tw`absolute right-3 top-10`}
                  size="small"
                  color={colors.primary.DEFAULT}
                />
              )}
              {selectedFileName && (
                <View style={tw`flex-row justify-between items-center`}>
                  <Text
                    style={tw`text-xs text-gray-500 mt-1 flex-1`}
                    numberOfLines={1}>
                    File: {selectedFileName}
                  </Text>
                  <TouchableOpacity onPress={clearFile} style={tw`p-1 mt-1`}>
                    <Text style={tw`text-xs text-primary-500`}>Change</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          name="uploadedDocument"
        />

        <Controller
          control={control}
          name="introduction"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Introduce Yourself"
              placeholder="Hello! I'm Nathan, a User Experience (UX) Consultant with 5 years of hands-on experience in crafting intuitive and delightful digital experiences. Passionate about merging design and functionality, I..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={6}
              inputStyle="h-32 text-top"
            />
          )}
        />

        <TouchableOpacity
          style={[
            tw`bg-primary rounded-md py-3 items-center mt-6 mb-4`,
            { backgroundColor: colors.primary.DEFAULT },
          ]}
          onPress={handleSubmit(onSubmit)}>
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-white font-medium text-base mr-2`}>Next</Text>
            <Feather name="chevron-right" size={18} color="white" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
