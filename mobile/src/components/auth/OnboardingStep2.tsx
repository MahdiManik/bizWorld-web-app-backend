import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OnboardingCompleteModal from '@/components/modals/OnboardingCompleteModal'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { Input } from '@/components/form/input'
import { useOnboarding } from '@/contexts/OnboardingContexts'
import { useForm, Controller } from 'react-hook-form'
import * as DocumentPicker from 'expo-document-picker'
import api from '@/lib/api'
import { uploadFileToStrapi } from '@/lib/upload'
import { CompanyFormData } from '@/services/company.service'
import { getCurrentUserId } from '@/services/auth.service'
import { companyStatusOptions, industryOptions } from 'data/profileData'
import { useCompanyStore } from '@/store/useCompanyStore'

export default function OnboardingStep2() {
  const router = useRouter()
  const { data, updateMultipleFields, setCurrentStep, resetData } =
    useOnboarding()
  const { saveCompany, error: companyError } = useCompanyStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  /* ------------ file picker functions ------------ */
  const uploadDocument = async () => {
    try {
      setUploadLoading(true)
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      })

      if (res.canceled) return

      const file = res.assets?.[0]
      if (!file) return

      console.log('📄 Starting company document upload...')
      
      // Upload file to Strapi and get file ID
      const uploadedFile = await uploadFileToStrapi(
        {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        },
        'files'
      )
      
      console.log('✅ Company document upload successful:', uploadedFile)
      const fileId = uploadedFile?.id
      if (!fileId) {
        throw new Error('No file ID returned from document upload')
      }

      setSelectedFileName(file.name)
      // Store file ID in context (not URI)
      updateMultipleFields({ companyDocument: fileId })
    } finally {
      setUploadLoading(false)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFileName(null)
    updateMultipleFields({ companyDocument: undefined })
  }

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting, isValid },
  } = useForm<CompanyFormData>({
    defaultValues: {
      name: data.name || '',
      status: data.status || 'published',
      location: data.location || '',
      size: data.size || '',
      revenue: data.revenue || '',
      description: data.description || '',
      industry: data.industry || '',
      companyDocument: data.companyDocument || null,
    },
    mode: 'onChange',
  })

  // Define a pre-submit function to debug form submission
  const debugFormSubmission = () => {
    console.log('=== FORM SUBMISSION BUTTON CLICKED ===')
    console.log('Form validation state:', { isValid, formErrors })
    // Display any form validation errors
    if (Object.keys(formErrors).length > 0) {
      console.error('Form has validation errors:', formErrors)
      return false
    }
    return true
  }

  const onSubmit = async (formData: CompanyFormData) => {
    if (!debugFormSubmission()) return

    setIsLoading(true)
    console.log('=== STARTING ONBOARDING STEP 2 CONFIRMATION ===')
    console.log('Form data submitted:', formData)
    console.log('Current form validation state:', {
      isSubmitting,
      isValid,
      formErrors,
    })

    try {
      setIsLoading(true)

      // Enhanced debug logging for token retrieval
      console.log('Starting API submission process...')

      let token = null
      try {
        token = await AsyncStorage.getItem('authToken')
        console.log('Retrieved token from AsyncStorage:', token)

        // Let's check all AsyncStorage keys to verify what's stored
        const allKeys = await AsyncStorage.getAllKeys()
        console.log('All AsyncStorage keys:', allKeys)

        if (!token) {
          console.warn('Auth token is null or empty in AsyncStorage')
        }
      } catch (storageError) {
        console.error('Error accessing AsyncStorage:', storageError)
      }

      // Combine WhatsApp country code and number for backend
      const fullWhatsapp = `${data.whatsappCountryCode}${data.whatsup}`.replace(
        /\s+/g,
        ''
      )

      const profileData = {
        professionalHeadline: data.professionalHeadline,
        industrySpecialization: data.industrySpecialization,
        areasOfExpertise: data.areasOfExpertise,
        portfolioLink: data.portfolioLink,
        whatsup: fullWhatsapp, // Backend expects single combined field
        image: data.profileImage, // Backend expects 'image' not 'profileImage'
        introduction: data.introduction,
        document: data.uploadedDocument, // Backend expects 'document' not 'documentUrl'
      }

      const companyData = {
        name: formData.name,
        industry: formData.industry,
        location: formData.location,
        size: formData.size || '',
        revenue: formData.revenue || '',
        description: formData.description,
        status: formData.status,
        document: formData.companyDocument, // Backend expects 'document' for both profile and company
      }

      // Get current user ID for API calls
      const userId = await getCurrentUserId()
      if (!userId) {
        throw new Error('User ID is not available for API calls')
      }

      let profileSuccess = false

      try {
        // Create profile following Strapi conventions: POST to collection endpoint
        // Include the user relation as specified in Strapi docs
        const profileResponse = await api.post(`/user-profiles`, {
          data: {
            ...profileData,
            users_permissions_user: userId, // Link this profile to the user
          },
        })
        if (!profileResponse.status) {
          throw new Error(`Profile creation failed: ${profileResponse.data}`)
        }

        profileSuccess = true
      } catch (profileError) {
        console.error('Profile API error:', profileError)
        throw profileError
      }

      if (profileSuccess) {
        // Use Zustand store for company operations - provides loading states and error handling
        const companySuccess = await saveCompany(companyData)

        if (!companySuccess) {
          throw new Error(companyError || 'Failed to save company data')
        }
      }

      // Show the onboarding complete modal instead of an alert
      resetData()
      setShowCompleteModal(true)
    } catch (error) {
      console.error('Onboarding error:', error)
      Alert.alert(
        'Error',
        `Failed to complete onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
    router.back()
  }

  const handleImageEdit = () => {
    console.log('Edit image pressed')
  }

  // File upload now handled by useDocumentUpload hook

  const handleBackToSignIn = async () => {
    console.log('⚠️ handleBackToSignIn called - Starting navigation process')
    setShowCompleteModal(false)

    // Force removal of ALL tokens to ensure no auth redirects block navigation
    try {
      console.log('⚠️ Clearing ALL auth tokens to force login page access')
      // Remove every possible token variation based on your screenshot
      const tokensToRemove = [
        'authToken',
        'auth_token',
        'access_token',
        'refresh_token',
        'refreshToken',
        'jwt',
      ]

      // Clear all tokens in parallel
      await Promise.all(
        tokensToRemove.map((token) => AsyncStorage.removeItem(token))
      )

      console.log('⚠️ All tokens cleared successfully')

      // Add a small delay to allow token clearing to complete
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Set a direct flag to bypass navigation guards
      await AsyncStorage.setItem('force_navigation', 'true')

      // Try multiple navigation approaches
      console.log('⚠️ Attempting navigation via router.replace')
      try {
        // Try the correct path based on your app structure
        // Since we saw in the onboarding path structure that auth is a group,
        // we need to use the proper path format
        router.replace('/(auth)/login')
        console.log('⚠️ router.replace executed successfully')
      } catch (e) {
        console.error('⚠️ router.replace failed:', e)

        console.log('⚠️ Attempting navigation via router.push')
        try {
          router.push('/(auth)/login')
          console.log('⚠️ router.push executed successfully')
        } catch (e2) {
          console.error('⚠️ router.push failed:', e2)

          // Fall back to direct path
          try {
            router.replace('/login')
            console.log('⚠️ Fallback router.replace executed')
          } catch (e3) {
            console.error('⚠️ All navigation attempts failed:', e3)
            Alert.alert(
              'Navigation Error',
              'Unable to navigate to login. Please try restarting the app.',
              [{ text: 'OK' }]
            )
          }
        }
      }
    } catch (tokenError) {
      console.error('⚠️ Error clearing auth tokens:', tokenError)
      // Still try to navigate even if token removal fails
      router.replace('/(auth)/login')
    }
  }

  return (
    <>
      {/* Onboarding Complete Modal - Positioned outside SafeAreaView for proper display */}
      <OnboardingCompleteModal
        visible={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onBackToSignIn={handleBackToSignIn}
      />

      <SafeAreaView style={tw`flex-1 bg-white`}>
        <ScrollView style={tw`flex-1 px-4`}>
          <View style={tw`items-center py-6`}>
            <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
              User Onboarding
            </Text>
            <Text style={tw`text-gray-600 text-center leading-6`}>
              Before you proceed, please fill in your company details. This
              ensures that the content you encounter is tailored to your needs!
            </Text>

            <View style={tw`flex-row mt-4`}>
              <TouchableOpacity onPress={handleBack}>
                <View style={tw`w-2 h-2 rounded-full bg-gray-300 mr-2`} />
              </TouchableOpacity>
              <View
                style={[
                  tw`w-2 h-2 rounded-full`,
                  { backgroundColor: colors.primary.DEFAULT },
                ]}
              />
            </View>
          </View>

          <Input
            type="image"
            imageUrl={data.profileImage}
            onEditImage={handleImageEdit}
            containerStyle="items-center mb-6"
          />

          <Controller
            control={control}
            rules={{
              required: 'Company name is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Company Name"
                placeholder="Enter company name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={formErrors.name?.message}
                required
              />
            )}
            name="name"
          />

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-800 font-medium mb-2`}>
              Company Status <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <Controller
              control={control}
              rules={{ required: 'Company status is required' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  type="radio"
                  options={companyStatusOptions}
                  selectedValue={value}
                  onSelect={(val) => onChange(val)}
                  error={formErrors.status?.message}
                />
              )}
              name="status"
            />
          </View>

          <Controller
            control={control}
            name="industry"
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
            rules={{
              required: 'Location is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Location"
                placeholder="Enter company location"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={formErrors.location?.message}
                required
              />
            )}
            name="location"
          />

          <Controller
            control={control}
            rules={{
              required: 'Company size is required',
              pattern: {
                value: /^\d+$/,
                message: 'Please enter a valid number',
              },
              validate: (value) => {
                const stringValue = typeof value === 'string' ? value : '0'
                return (
                  parseInt(stringValue || '0', 10) > 0 ||
                  'Company size must be greater than 0'
                )
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Company Size"
                placeholder="Enter number of employees (e.g., 10)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={formErrors.size?.message}
                required
              />
            )}
            name="size"
          />

          <Controller
            control={control}
            rules={{
              required: 'Revenue is required',
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: 'Please enter a valid number',
              },
              validate: (value) =>
                parseFloat(value || '0') >= 0 || 'Revenue cannot be negative',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Revenue"
                placeholder="Enter annual revenue (numbers only)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={formErrors.revenue?.message}
                required
              />
            )}
            name="revenue"
          />

          <Controller
            control={control}
            render={({ field: { value } }) => (
              <View>
                <Input
                  label="Upload Document"
                  type="file"
                  value={
                    selectedFileName || (typeof value === 'string' ? value : '')
                  }
                  onRightIconPress={!uploadLoading ? uploadDocument : undefined}
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
                    <TouchableOpacity
                      onPress={clearSelectedFile}
                      style={tw`p-1 mt-1`}>
                      <Text style={tw`text-xs text-primary-500`}>Change</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            name="companyDocument"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Description"
                placeholder="Enter description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={8}
                inputStyle="h-40 text-top"
              />
            )}
            name="description"
          />

          <TouchableOpacity
            style={[
              tw`rounded-md py-3 items-center mt-6 mb-4`,
              { backgroundColor: colors.primary.DEFAULT },
              isLoading && tw`opacity-70`,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            <Text style={tw`text-white font-medium text-base`}>
              {isLoading ? 'Processing...' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}
