/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router/build/hooks'
// Bypass TypeScript module resolution issue
const reactHookForm = require('react-hook-form');
const { useForm, FormProvider } = reactHookForm;
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '@/lib/api' // Import api client for direct API calls
// Bypass TypeScript module resolution issue
const FileSystem = require('expo-file-system')
// Bypass TypeScript module resolution issue
const Toast = require('react-native-toast-message')
import tw from '@/lib/tailwind'
// Bypass TypeScript module resolution issue
const ImagePicker = require('expo-image-picker')
import { GeneralInfoPage } from '@/components/Listing/add-edit-listing/GeneralInfoPage'
import { RevenueBreakdownPage } from '@/components/Listing/add-edit-listing/RevenueBreakdownPage'
import { ConfidentialDocumentsPage } from '@/components/Listing/add-edit-listing/ConfidentialDocumentsPage'
import useListingStore from '@/store/useListingStore'
import { getCurrentUserId } from '@/services/auth.service'
import { userService } from '@/services/user.service'

type Document = {
  id: string
  name: string
  uri: string
  type: string
}

type ListingFormData = {
  // General Info
  title: string
  location: string
  image: string | null
  description: string
  companyName: string
  industry: string
  businessType: string
  established: string
  employees: string
  askingPrice: string
  equityOffered: string
  revenue: string
  profitMargin: string
  growthRate: string
  category: string
  visibility: string // ✅ Added this field

  // Financial Metrics
  ebitda: string
  revenueYoY: string
  ebitdaYoY: string
  profitMarginYoY: string

  // Monthly Revenue
  monthlyRevenue: {
    Jan: string
    Feb: string
    Mar: string
    Apr: string
    May: string
    Jun: string
    Jul: string
    Aug: string
    Sep: string
    Oct: string
    Nov: string
    Dec: string
  }
}

export default function EditListingScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  // Get listing ID from route params or use default for testing
  // Always ensure ID is a string
  const listingId = id ? String(id) : '1'

  console.log('[EditListingScreen] Editing listing with ID:', listingId)

  if (!id) {
    console.warn('[EditListingScreen] No listing ID provided in URL parameters')
  }

  // Store and form setup
  const { loading, fetchListingById, updateListing } = useListingStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [progress, setProgress] = useState(25)
  const [documents, setDocuments] = useState<Document[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // React Hook Form setup
  // Remove generic type to avoid TypeScript error with CommonJS require
  const methods = useForm({
    defaultValues: {
      title: '',
      location: '',
      category: '',
      image: null,
      description: '',
      companyName: '',
      industry: '',
      businessType: '',
      established: '',
      employees: '',
      askingPrice: '',
      equityOffered: '',
      revenue: '',
      profitMargin: '',
      growthRate: '',
      ebitda: '',
      revenueYoY: '',
      ebitdaYoY: '',
      profitMarginYoY: '',
      monthlyRevenue: {
        Jan: '',
        Feb: '',
        Mar: '',
        Apr: '',
        May: '',
        Jun: '',
        Jul: '',
        Aug: '',
        Sep: '',
        Oct: '',
        Nov: '',
        Dec: '',
      },
    },
  })

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = methods

  // Helper function to convert base64 data to a file
  const createFileFromBase64 = async (
    base64Data: string,
    filename: string
  ): Promise<string> => {
    // Remove the data:image/xyz;base64, prefix if present
    const base64Content = base64Data.includes(',')
      ? base64Data.split(',')[1]
      : base64Data
    const filePath = FileSystem.cacheDirectory + filename

    console.log('[createFileFromBase64] Writing base64 to file:', filePath)

    await FileSystem.writeAsStringAsync(filePath, base64Content, {
      encoding: FileSystem.EncodingType.Base64,
    })

    console.log('[createFileFromBase64] File created successfully')
    return filePath
  }

  // Initialize user ID and fetch listing data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get current user ID
        const currentUserId = await getCurrentUserId()
        setUserId(currentUserId)
        console.log('[EditListingScreen] Current user ID:', currentUserId)

        // Check auth token
        let token = null
        try {
          token = await AsyncStorage.getItem('authToken')
          console.log('[EditListingScreen] Has auth token:', !!token)
        } catch (storageError) {
          console.error(
            '[EditListingScreen] Error accessing AsyncStorage:',
            storageError
          )
        }

        if (!token) {
          Alert.alert('Error', 'Please log in to edit listings.')
          router.replace('/')
          return
        }

        // Fetch listing data from API
        console.log(
          '[EditListingScreen] Fetching listing data for ID:',
          listingId
        )
        const listing = await fetchListingById(listingId)

        if (listing) {
          console.log('[EditListingScreen] Listing data fetched:', listing)

          // Populate form with fetched data
          // Set the image if it exists
          if (listing?.attributes?.image) {
            // Ensure image URL is properly formatted with timestamp to prevent caching
            const imageUrl = listing?.attributes?.image.includes('?')
              ? listing?.attributes?.image
              : `${listing?.attributes?.image}?t=${Date.now()}`
            setSelectedImage(imageUrl)
            console.log('[EditListingScreen] Setting image URL:', imageUrl)
          }

          reset({
            title: listing?.attributes.title || '',
            location: listing?.attributes.location || '',
            category: listing?.attributes.category || '',
            image: listing?.attributes.image || null,
            visibility: 'private', // ✅ added
            description: listing?.attributes.company?.description || '',
            companyName: listing?.attributes.company?.name || '',
            industry: listing?.attributes.company?.industry || '',
            businessType: listing?.attributes.company?.businessType || '',
            established: listing?.attributes.company?.established || '',
            employees: listing?.attributes.company?.employees || '',
            askingPrice: listing?.attributes.askingPrice || '',
            equityOffered: listing?.attributes.company?.equityOffered || '',
            revenue: '0',
            profitMargin: '0',
            growthRate: '0',
            ebitda: listing?.attributes.financialMetric?.ebitda || '0',
            revenueYoY:
              listing?.attributes.financialMetric?.revenueYoYChange || '0',
            ebitdaYoY:
              listing?.attributes.financialMetric?.ebitdaYoYChange || '0',
            profitMarginYoY:
              listing?.attributes.financialMetric?.profitMarginYoYChange || '0',
            monthlyRevenue: {
              Jan:
                listing?.attributes.monthlyFinancials?.find(
                  (m) => m.month === 1
                )?.revenue || '0',
              Feb:
                listing?.attributes.monthlyFinancials?.find(
                  (m) => m.month === 2
                )?.revenue || '0',
              Mar:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 3)
                  ?.revenue || '0',
              Apr:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 4)
                  ?.revenue || '0',
              May:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 5)
                  ?.revenue || '0',
              Jun:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 6)
                  ?.revenue || '0',
              Jul:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 7)
                  ?.revenue || '0',
              Aug:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 8)
                  ?.revenue || '0',
              Sep:
                listing.attributes.monthlyFinancials?.find((m) => m.month === 9)
                  ?.revenue || '0',
              Oct:
                listing.attributes.monthlyFinancials?.find(
                  (m) => m.month === 10
                )?.revenue || '0',
              Nov:
                listing.attributes.monthlyFinancials?.find(
                  (m) => m.month === 11
                )?.revenue || '0',
              Dec:
                listing.attributes.monthlyFinancials?.find(
                  (m) => m.month === 12
                )?.revenue || '0',
            },
          })

          // Set documents if available (mock for now)
          setDocuments([])
        }
      } catch (error) {
        console.error('[EditListingScreen] Error initializing data:', error)
        Alert.alert('Error', 'Failed to load listing data. Please try again.')
      }
    }

    initializeData()
  }, [listingId, fetchListingById, reset, router])

  // Image picker function
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload images.'
        )
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using existing API
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: Platform.OS !== 'web', // Only enable base64 on native platforms
      })

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0]
        // Get the original URI (could be file:// or data:image/...)
        let imageUri = selectedAsset.uri
        console.log(
          '[pickImage] Selected image type:',
          imageUri.substring(0, 20) + '...'
        )

        // If we have a data URI, convert it to a file first (only on native platforms)
        if (imageUri.startsWith('data:image/')) {
          console.log('[pickImage] Detected data URI')
          const extension = selectedAsset.type?.split('/')[1] || 'jpg'
          const filename = `listing-${Date.now()}.${extension}`

          if (Platform.OS !== 'web') {
            // Only convert on native platforms (iOS/Android)
            console.log(
              '[pickImage] Converting data URI to file on native platform'
            )
            imageUri = await createFileFromBase64(imageUri, filename)
            console.log('[pickImage] Converted to file URI:', imageUri)
          } else {
            // Web platform doesn't support this flow
            console.warn('[pickImage] File conversion skipped on web platform')
            Alert.alert(
              'Image Upload Not Supported on Web',
              'Please use a native device (iOS/Android) for image uploads.'
            )
            return
          }
        }

        // Now we have a proper file:// URI
        console.log(
          '[pickImage] Final image URI:',
          imageUri.substring(0, 30) + '...'
        )

        // Set the image in state and form values
        setSelectedImage(imageUri)
        setValue('image', imageUri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image',
        position: 'bottom',
      })
    }
  }

  // Upload image to server
  const uploadImage = async (
    uri: string,
    listingId: string
  ): Promise<string | null> => {
    try {
      console.log(
        '[uploadImage] Starting image upload for URI:',
        uri.substring(0, 30) + '...'
      )
      console.log('[uploadImage] Listing ID:', listingId)

      const uploadUrl = `/documents/listing/${listingId}`
      console.log('[uploadImage] Upload endpoint URL:', uploadUrl)

      const formData = new FormData()

      // Now we only handle file:// URIs (data URIs are converted earlier)
      if (uri.startsWith('file://')) {
        console.log('[uploadImage] Handling file:// URI')
        // Extract file extension from URI
        const extension = uri.split('.').pop() || 'jpg'
        const filename = `listing-${listingId}-${Date.now()}.${extension}`
        console.log('[uploadImage] Created filename:', filename)

        // Create file object for React Native FormData
        const file = {
          uri: uri,
          name: filename,
          type: `image/${extension}`,
        }

        console.log('[uploadImage] File object:', JSON.stringify(file))
        formData.append('image', file as any)
        console.log(
          '[uploadImage] Appended file to form data with field name: image'
        )
      } else {
        console.warn(
          '[uploadImage] Unsupported image URI format - only file:// URIs are supported',
          uri.substring(0, 30)
        )
        return null
      }

      // Log form data contents for debugging
      console.log(
        '[uploadImage] Form data created with fields:',
        Object.keys(formData).length > 0
          ? Object.keys(formData)
          : 'FormData object - fields not directly accessible'
      )

      // Get token for authorization
      const token = await AsyncStorage.getItem('authToken')
      console.log('[uploadImage] Auth token available:', !!token)

      // Log the full request we're about to make
      console.log(
        '[uploadImage] Making POST request to:',
        uploadUrl,
        'with Content-Type: multipart/form-data and Authorization header'
      )

      // Upload image to listing document endpoint
      const response = await api.post(uploadUrl, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: token || '',
        },
      })

      // Log the upload response
      console.log('[uploadImage] Upload response status:', response.status)
      console.log(
        '[uploadImage] Full upload response data:',
        JSON.stringify(response.data)
      )

      // Extract document URL from the response - handle both formats
      // Format 1: { data: { documentUrl: 'url' } }
      // Format 2: { documentUrl: 'url' }
      const documentUrl =
        response?.data?.data?.documentUrl || response?.data?.documentUrl

      console.log('[uploadImage] Extracted document URL:', documentUrl)

      if (!documentUrl) {
        console.error(
          '[uploadImage] Failed to extract document URL from response'
        )
        return null
      }

      return documentUrl
    } catch (error: any) {
      console.error('[uploadImage] Error uploading image:', error)
      if (error.response) {
        console.error(
          '[uploadImage] Error response status:',
          error.response.status
        )
        console.error('[uploadImage] Error response data:', error.response.data)
      }
      return null
    }
  }

  // Form handlers using React Hook Form
  const handleUpdateGeneralInfo = (key: string, value: any) => {
    setValue(key as keyof ListingFormData, value)
  }

  const handleUpdateMonthlyRevenue = (month: string, value: string) => {
    console.log(
      `[EditListingScreen] Updating monthly revenue for ${month}:`,
      value
    )
    const cleanValue = value.replace(/[^0-9.]/g, '')

    // Use setValue with explicit path to ensure React Hook Form updates correctly
    // Properly type the monthlyRevenue field path
    setValue(`monthlyRevenue.${month}` as any, cleanValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleUpdateFinancialMetrics = (key: string, value: string) => {
    console.log(`[EditListingScreen] Updating financial metric ${key}:`, value)
    setValue(key as keyof ListingFormData, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  // Update progress based on current page
  React.useEffect(() => {
    if (currentPage === 1) setProgress(25)
    else if (currentPage === 2) setProgress(50)
    else if (currentPage === 3) setProgress(75)
  }, [currentPage])

  // Form submission handler
  const onSubmit = async (data: ListingFormData) => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated')
      return
    }

    setIsSubmitting(true)
    console.log('[EditListingScreen] Submitting form data:', data)

    // Handle image upload if a new image was selected
    let imageUrl = data.image

    try {
      console.log(
        '[EditListingScreen] Selected image type:',
        typeof selectedImage,
        selectedImage ? selectedImage.substring(0, 20) + '...' : 'none'
      )
      console.log(
        '[EditListingScreen] Current image URL:',
        imageUrl ? imageUrl.substring(0, 20) + '...' : 'none'
      )

      // SAFETY CHECK: Make sure we never have a data URI in imageUrl variable
      if (
        imageUrl &&
        typeof imageUrl === 'string' &&
        imageUrl.startsWith('data:')
      ) {
        console.warn(
          '[EditListingScreen] Found data URI in imageUrl - clearing'
        )
        imageUrl = null // Don't use data URIs in the update
      }

      // Check if we need to upload a new image
      const isNewImage =
        selectedImage &&
        selectedImage !== imageUrl &&
        (selectedImage.startsWith('file:') || selectedImage.startsWith('data:'))

      if (isNewImage && selectedImage) {
        // Added null check
        console.log('[EditListingScreen] Uploading new cover image...')
        console.log(
          '[EditListingScreen] Image upload URL:',
          `/documents/listing/${listingId}`
        )

        const uploadedImageUrl = await uploadImage(selectedImage, listingId)

        if (uploadedImageUrl) {
          console.log(
            '[EditListingScreen] Image uploaded successfully, URL:',
            uploadedImageUrl
          )
          // Use ONLY the uploaded image URL, never the original data URI
          imageUrl = uploadedImageUrl
        } else {
          console.error('[EditListingScreen] Failed to upload image')
          // Don't use the original image if it was a data URI and upload failed
          if (selectedImage.startsWith('data:')) {
            console.warn(
              '[EditListingScreen] Clearing image URL to prevent data URI usage'
            )
            imageUrl = null
          }
        }
      } else {
        console.log(
          '[EditListingScreen] No new image to upload or using remote image'
        )
      }
    } catch (error) {
      console.error('[EditListingScreen] Error uploading image:', error)
      console.error('[EditListingScreen] Error details:', JSON.stringify(error))
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload cover image',
        position: 'bottom',
      })
      // Continue with listing update even if image upload fails
    }

    try {
      // First, get the current company info to have all existing fields
      const company = await userService.getCompanyInfo()
      const companyId = company.id

      // Create base companyData with existing company fields
      const companyData: any = { ...company }

      // Only update fields that have values in the form - optional fields
      if (data.companyName) companyData.name = data.companyName
      if (data.industry) companyData.industry = data.industry
      if (data.businessType) companyData.businessType = data.businessType
      if (data.established) companyData.established = data.established
      if (data.employees) companyData.size = data.employees // Map employees to size field
      if (data.location) companyData.location = data.location
      if (data.equityOffered) companyData.equityOffered = data.equityOffered
      if (data.description) companyData.description = data.description

      // Ensure required fields are present (from existing or form data)
      companyData.id = companyId // Ensure company ID is set
      companyData.status = company.status || 'active'
      companyData.revenue = data.revenue || company.revenue || '0'

      console.log('[EditListingScreen] Company data to update:', companyData)
      // Include documents field and ensure companyData is complete
      const companyDataComplete = {
        ...companyData,
        documents: company.documents || [],
      }

      // Use the direct API approach that works in AddNewListingScreen
      console.log(
        '[EditListingScreen] Updating company with:',
        companyDataComplete
      )

      // Check if we have auth token before attempting update (same as AddNewListingScreen)
      let token = null
      try {
        token = await AsyncStorage.getItem('authToken')
        console.log(
          '[EditListingScreen] Auth token available for company update:',
          !!token
        )
      } catch (storageError) {
        console.error(
          '[EditListingScreen] Error accessing AsyncStorage:',
          storageError
        )
      }

      if (token) {
        try {
          // Try with explicit Authorization header - use userId not companyId for the endpoint
          const companyResponse = await api.patch(
            `/company/user/${userId}`, // Use userId here, not companyId
            companyDataComplete,
            {
              headers: {
                Authorization: token, // Using token directly without Bearer prefix
                'Content-Type': 'application/json',
              },
            }
          )

          console.log(
            '[EditListingScreen] Company update response:',
            companyResponse?.data
          )

          if (!companyResponse || !companyResponse.data) {
            console.warn(
              'Company update failed but continuing with listing update'
            )
          } else {
            console.log('Company updated successfully')
          }
        } catch (error) {
          console.warn(
            'Failed to update company but continuing with listing:',
            error
          )
        }
      } else {
        console.log(
          '[EditListingScreen] Skipping company update - no auth token available'
        )
      }

      // Create an object to hold only the fields that have values (make all fields optional)
      const listingData: any = {}

      console.log(
        '[EditListingScreen] Form data image field:',
        JSON.stringify(data.image).substring(0, 40) + '...'
      )
      console.log(
        '[EditListingScreen] imageUrl variable:',
        imageUrl ? imageUrl.substring(0, 40) + '...' : 'null'
      )

      // Only add fields that have values
      if (data.title) listingData.title = data.title

      // Check for data URI in form data and imageUrl
      const formDataHasDataUri =
        data.image &&
        typeof data.image === 'string' &&
        data.image.startsWith('data:')
      const imageUrlHasDataUri =
        imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:')

      console.log(
        '[EditListingScreen] Form data contains data URI:',
        formDataHasDataUri
      )
      console.log(
        '[EditListingScreen] imageUrl contains data URI:',
        imageUrlHasDataUri
      )

      // Handle image field - NEVER include data URIs
      if (imageUrl && !imageUrlHasDataUri) {
        console.log(
          '[EditListingScreen] Adding image URL to update data:',
          imageUrl.substring(0, 40) + '...'
        )
        listingData.image = imageUrl
      } else if (imageUrlHasDataUri) {
        console.warn(
          '[EditListingScreen] Skipping image field in update - contains data URI'
        )
      } else {
        console.log(
          '[EditListingScreen] No valid image URL to include in update'
        )
      }

      if (data.askingPrice) listingData.askingPrice = data.askingPrice
      if (data.location) listingData.location = data.location
      if (data.description) listingData.description = data.description
      if (data.category) listingData.category = data.category

      // Add financial data if available
      if (data.revenue) listingData.revenue = data.revenue
      if (data.profitMargin) listingData.profitMargin = data.profitMargin
      if (data.growthRate) listingData.growthRate = data.growthRate
      if (data.ebitda) listingData.ebitda = data.ebitda
      if (data.revenueYoY) listingData.revenueYoY = data.revenueYoY
      if (data.ebitdaYoY) listingData.ebitdaYoY = data.ebitdaYoY
      if (data.profitMarginYoY)
        listingData.profitMarginYoY = data.profitMarginYoY

      // Check if we have monthly revenue data to update
      const monthlyData = []
      if (data.monthlyRevenue) {
        for (const [month, revenue] of Object.entries(data.monthlyRevenue)) {
          if (revenue) {
            const monthNumber =
              [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ].findIndex((m) => m === month) + 1

            const revenueNum = parseFloat(revenue.toString()) || 0
            const ebitdaValue = Math.round(revenueNum * 0.25).toString()

            monthlyData.push({
              month: monthNumber,
              year: new Date().getFullYear(),
              revenue: revenue.toString(),
              ebitda: ebitdaValue,
              profitMargin: '25%',
            })
          }
        }

        if (monthlyData.length > 0) {
          listingData.monthlyData = monthlyData
        }
      }

      console.log(
        '[EditListingScreen] Calling updateListing with:',
        JSON.stringify(listingData, null, 2),
        companyId
      )

      // Use the API client to update the listing
      try {
        console.log(
          `[EditListingScreen] Making API call to update listing: PATCH /listings/${listingId}`
        )

        // CRITICAL: Final safeguard against data URIs in the request payload
        const finalListingData = { ...listingData }

        // Explicitly check and remove image field if it contains a data URI
        if (
          finalListingData.image &&
          typeof finalListingData.image === 'string'
        ) {
          if (finalListingData.image.startsWith('data:')) {
            console.warn(
              '[EditListingScreen] *FINAL CHECK* Removing data URI from request payload'
            )
            delete finalListingData.image
          } else {
            console.log(
              '[EditListingScreen] Image URL is safe to send:',
              finalListingData.image.substring(0, 30) + '...'
            )
          }
        }

        // Log the final request payload for verification
        console.log(
          '[EditListingScreen] Final request payload:',
          JSON.stringify(finalListingData, null, 2).substring(0, 200) + '...'
        )

        const response = await api.patch(
          `/listings/${listingId}`,
          finalListingData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token || '', // Use token if available
            },
          }
        )

        console.log(
          '[EditListingScreen] Listing update response:',
          response?.data
        )

        if (response && response.data) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Your listing has been successfully updated',
            position: 'bottom',
          })
          router.replace(`/listing/${listingId}`)
        } else {
          throw new Error('Update failed - no data returned')
        }
      } catch (updateError) {
        console.error(
          '[EditListingScreen] Error updating listing:',
          updateError
        )
        throw updateError // Re-throw to be caught by outer catch block
      }
    } catch (error) {
      console.error('[EditListingScreen] Error updating listing:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error instanceof Error ? error.message : 'Failed to update listing',
        position: 'bottom',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1)
    } else {
      // Submit the form
      handleSubmit(onSubmit)()
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else {
      router.back()
    }
  }

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={tw`mt-4 text-gray-600`}>Loading listing data...</Text>
        </View>
      )
    }

    switch (currentPage) {
      case 1:
        return (
          <GeneralInfoPage
            isEditMode={true}
            disabledFields={[]} // No disabled fields for now
            onPickImage={pickImage}
          />
        )
      case 2:
        return (
          <RevenueBreakdownPage
            monthlyRevenue={getValues().monthlyRevenue}
            setMonthlyRevenue={handleUpdateMonthlyRevenue}
            financialMetrics={{
              ebitda: getValues().ebitda,
              revenueYoY: getValues().revenueYoY,
              ebitdaYoY: getValues().ebitdaYoY,
              profitMarginYoY: getValues().profitMarginYoY,
            }}
            setFinancialMetrics={handleUpdateFinancialMetrics}
            isEditMode={true}
          />
        )
      case 3:
        return (
          <ConfidentialDocumentsPage
            documents={documents}
            setDocuments={setDocuments}
            isEditMode={true}
          />
        )
      default:
        return null
    }
  }

  return (
    <FormProvider {...methods}>
      <View style={tw`flex-1 bg-white`}>
        {/* Header */}
        <View
          style={tw`flex-row items-center justify-between border-b border-gray-200 px-4 py-3`}>
          <TouchableOpacity onPress={handlePrevious}>
            <Feather name="arrow-left" size={24} color="#1e3a8a" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold`}>Edit Listing</Text>
          <View style={tw`w-6`} />
        </View>

        {renderCurrentPage()}

        <View
          style={tw`absolute bottom-0 right-0 left-0 p-4 bg-white border-t border-gray-200 flex-row justify-between`}>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-md py-3 px-6 flex-row items-center`}
            onPress={handlePrevious}
            disabled={loading || isSubmitting}>
            <Feather name="chevron-left" size={20} color="#374151" />
            <Text style={tw`text-gray-800 font-medium ml-2`}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-blue-900 rounded-md py-3 px-6 flex-row items-center`}
            onPress={handleNext}
            disabled={loading || isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={tw`text-white font-bold mr-2`}>
                  {currentPage === 3 ? 'Save Listing' : 'Next'}
                </Text>
                {currentPage < 3 && (
                  <Feather name="chevron-right" size={20} color="white" />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </FormProvider>
  )
}
