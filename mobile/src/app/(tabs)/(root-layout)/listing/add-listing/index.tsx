import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useForm, FormProvider } from 'react-hook-form'
const Toast = require('react-native-toast-message')
import tw from '@/lib/tailwind'
import { RevenueBreakdownPage } from '@/components/Listing/add-edit-listing/RevenueBreakdownPage'
import { SuccessModal } from '@/components/Listing/add-edit-listing/SuccessModal'
import { GeneralInfoPage } from '@/components/Listing/add-edit-listing/GeneralInfoPage'
import { ConfidentialDocumentsPage } from '@/components/Listing/add-edit-listing/ConfidentialDocumentsPage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ListingCreateInput } from '@/types/listing'
import { useAuth } from '@/contexts/AuthContext'
import { useListings } from '@/contexts/ListingContext'

export default function AddNewListingScreen({ navigation }: any) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [progress, setProgress] = useState(25)
  const [disabledFields, setDisabledFields] = useState<string[]>([])
  const { user } = useAuth()
  const { current, loading, error, createListing } = useListings()
  // useEffect(() => {
  //   if (user?.id) {
  //     createListing()
  //   }
  // }, [user?.id])

  console.log('current listing', current)

  // Setup React Hook Form
  const methods = useForm<ListingCreateInput>({
    defaultValues: {
      // General Info
      title: '',
      country: '',
      category: '',
      image: null,
      visibility: 'Private',
      description: '',
      companyName: '',
      industry: '',
      type: 'SMALL_BUSINESS',
      established: '',
      employees: '',
      askingPrice: '',
      equityOffered: '',
      // Financial metrics with default values
      revenue: '',
      revenueYoY: '0',
      ebitda: '',
      ebitdaYoY: '0',
      profitMargin: '0',
      profitMarginYoY: '0',
      growthRate: '0',
      monthlyFinancials: {},
      monthlyRevenue: {},
      document: [],
    },
  })

  // Extract form methods
  const { setValue, watch } = methods
  const monthlyRevenue = watch('monthlyFinancials')

  // Display error toast if there's an error from the store
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        position: 'top',
      })
    }
  }, [error])

  useEffect(() => {
    if (currentPage === 1) setProgress(25)
    else if (currentPage === 2) setProgress(50)
    else if (currentPage === 3) setProgress(75)
  }, [currentPage])

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1)
    } else {
      // Submit form
      handleSubmitListing()
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else {
      navigation.goBack()
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigation.navigate('Listings')
  }

  const handleUpdateMonthlyRevenue = (month: string, value: string) => {
    setValue(`monthlyRevenue.${month}` as any, value.replace(/[^0-9.]/g, ''))
  }
  // Handle form submission and API call
  const handleSubmitListing = async () => {
    try {
      if (!user?.id) {
        console.log('[AddNewListingScreen] No user ID available')
        return
      }
      // Check if user has auth token
      let token = null
      try {
        token = await AsyncStorage.getItem('authToken')
        console.log(
          '[AddNewListingScreen] Retrieved token from AsyncStorage:',
          !!token
        )
      } catch (storageError) {
        console.error(
          '[AddNewListingScreen] Error accessing AsyncStorage:',
          storageError
        )
      }

      if (!token) {
        console.log(
          '[AddNewListingScreen] No auth token found - user may not be logged in'
        )
      }

      // Validate form data
      const formData = methods.getValues()
      console.log('[AddNewListingScreen] Form data:', formData)

      // Validate required fields
      if (!formData.title?.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Listing title is required',
          position: 'top',
        })
        setCurrentPage(1) // Go back to first page
        return
      }

      // Validate required fields
      if (!formData.askingPrice || !formData.country) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill in all required fields',
          position: 'top',
        })
        return
      }

      // Prepare the listing data for submission
      const listingData: ListingCreateInput = {
        id: null as any, // Optional: adjust based on backend expectations
        title: formData.title,
        description: formData.description || '',
        askingPrice: formData.askingPrice,
        visibility: formData.visibility || 'Private',
        type: formData.type || 'SMALL_BUSINESS',
        country: formData.country,
        industry: formData.industry,
        category: formData.category,
        user: user,
        equityOffered: formData.equityOffered,
        employees: formData.employees,
        established: formData.established,
        marginYoY: formData.marginYoY,
        growthRate: formData.growthRate,
        companyName: formData.companyName,
        isFavorite: formData.isFavorite || false,
        image: formData.image || null,
        document: formData.document || null,

        ebitdaYoY: formData.ebitdaYoY,
        revenueYoY: formData.revenueYoY,
        ebitda: formData.ebitda,
        profitMargin: formData.profitMargin,

        monthlyFinancials: Object.entries(formData.monthlyFinancials || {}).map(
          ([month]) => {
            const monthNames = [
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
            ]
            const monthNumber = monthNames.findIndex((m) => m === month) + 1

            return {
              month: monthNumber,
              year: new Date().getFullYear(),
              revenue: formData.revenueYoY,
              ebitda: formData.ebitda,
              profitMargin: formData.profitMargin,
            }
          }
        ),
      }

      console.log(
        '[AddNewListingScreen] Listing data being sent:',
        JSON.stringify(listingData, null, 2)
      )

      const result = await createListing(listingData)
      console.log('[AddNewListingScreen] Create listing result:', result)

      if (result) {
        setShowSuccessModal(true)
      }
    } catch (err) {
      console.error('Error submitting listing:', err)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create listing. Please try again.',
        position: 'top',
      })
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <GeneralInfoPage disabledFields={disabledFields} />
      case 2:
        return (
          <RevenueBreakdownPage
            monthlyRevenue={monthlyRevenue || []}
            setMonthlyRevenue={handleUpdateMonthlyRevenue}
          />
        )
      case 3:
        return (
          <ConfidentialDocumentsPage
            documents={listingData.document}
            setDocuments={(documents) => {
              // Ensure consistent document format with name property
              setDocuments(documents as Document[])
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <FormProvider {...methods}>
      <View style={tw`flex-1 bg-gray-50`}>
        <View style={tw`px-4 py-2 flex-row items-center`}>
          <View style={tw`flex-1 h-2 bg-gray-200 rounded-full`}>
            <View
              style={[
                tw`h-2 bg-blue-900 rounded-full`,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {isLoadingUserId || fetchingCompany ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={tw`mt-4 text-gray-700`}>
              {isLoadingUserId
                ? 'Loading user data...'
                : 'Loading company data...'}
            </Text>
          </View>
        ) : (
          renderCurrentPage()
        )}

        <View
          style={tw`absolute bottom-0 right-0 left-0 p-4 bg-white flex-row ${currentPage > 1 ? 'justify-between' : 'justify-end'}`}>
          {currentPage > 1 && (
            <TouchableOpacity
              style={tw`border border-gray-300 rounded-md py-3 px-6 flex-row items-center`}
              onPress={handlePrevious}>
              <Feather name="chevron-left" size={20} color="#374151" />
              <Text style={tw`text-gray-800 font-medium ml-2`}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={tw`bg-blue-900 rounded-md py-3 px-6 flex-row items-center ${loading ? 'opacity-70' : ''}`}
            onPress={handleNext}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" style={tw`mr-2`} />
            ) : (
              <Text style={tw`text-white font-bold mr-2`}>
                {currentPage === 3 ? 'Submit Listing' : 'Next'}
              </Text>
            )}
            {!loading && currentPage < 3 && (
              <Feather name="chevron-right" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <SuccessModal
          visible={showSuccessModal}
          onClose={handleSuccessModalClose}
        />
      </View>
    </FormProvider>
  )
}
