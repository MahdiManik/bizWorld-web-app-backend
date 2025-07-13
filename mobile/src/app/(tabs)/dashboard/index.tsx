/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native'
// Use react-native ActivityIndicator but bypass TypeScript error
const ActivityIndicator = require('react-native').ActivityIndicator
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { setActiveListingTab, setCurrentNavTab } from '@/utils/navigationState'
import tw from '@/lib/tailwind'
import { UserGreeting } from '@/components/Dashboard/UserGreeting'
import { SearchInput } from '@/components/Listing/SearchInput'
import { StatCard } from '@/components/Dashboard/StatCard'
import { SectionHeader } from '@/components/Dashboard/SelectionHeader'
import { ListingCard } from '@/components/Listing/ListingCard'
import { CompactListingCard } from '@/components/Listing/CompactListingCard'
import { useProtectedPageGuard } from '@/hooks/useNavigationGuard'
import { GuardedScreen } from '@/components/guards/GuardedScreen'
import { ConsultantProfile } from '@/components/Dashboard/ConsultantProfile'
import { colors } from '@/constants/colors'
import Navbar from '@/components/Navbar'
import FilterModal, { FilterValues } from '@/components/Dashboard/FilterModal'
// import { mockUserProfile } from 'data/profileData'
import { Listing, ListingAttributes } from 'types/listing'
import { listingService } from '@/services/listing.service'
import { getCurrentUserId } from '@/services/auth.service'
import { useToast } from '@/utils/toast'
import { userService } from '@/services/user.service'
import { ConfirmationModal } from '@/components/profileSettings/ConfirmationModal'

type Consultant = {
  id: string
  name: string
  image: string
}

const consultants: Consultant[] = [
  { id: '1', name: 'Amanda', image: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Anderson', image: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Samantha', image: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Andrew', image: 'https://i.pravatar.cc/150?img=4' },
]

export default function DashboardScreen() {
  // const toast = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [listingToDelete, setListingToDelete] =
    useState<ListingAttributes | null>(null)
  // Navigation guard - require authentication and completed onboarding
  const { canAccess, isLoading } = useProtectedPageGuard()
  const [filterValues, setFilterValues] = useState<FilterValues>({
    industries: [],
    priceRange: {
      min: '',
      max: '',
    },
    businessType: 'Startup',
    investmentType: 'Full Sale',
  })
  // State to store listings from the API
  const [myListings, setMyListings] = useState<ListingAttributes[]>([])
  const [exploreListings, setExploreListings] = useState<ListingAttributes[]>(
    []
  )
  const [browseListings, setBrowseListings] = useState<ListingAttributes[]>([])
  const [myInterests, setMyInterests] = useState<ListingAttributes[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [userData, setUserData] = useState<{
    firstName: string
    lastName: string
    profileImage?: string
  }>({ firstName: '', lastName: '' })
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const toast = useToast()

  // Match the function signature from the listing page
  const handleListingPress = (id: string | number) => {
    // Always convert ID to string to ensure consistency
    const stringId = String(id)
    console.log('Navigating to listing with ID:', stringId)
    router.push(`/listing/${stringId}`)
  }

  const handleMenuPress = (listing: ListingAttributes) => {
    setActiveMenu(activeMenu === listing.id ? null : listing.id)
  }

  const handleEdit = (listing: ListingAttributes) => {
    setActiveMenu(null)
    router.push(`/listing/edit-listing?id=${listing.id}`)
  }

  const handleDelete = (listing: ListingAttributes) => {
    setActiveMenu(null)
    setListingToDelete(listing)
    setShowDeleteModal(true)
  }

  const confirmDeleteListing = async () => {
    if (!listingToDelete) return

    try {
      setShowDeleteModal(false)

      await listingService.deleteListing(listingToDelete.id)

      setMyListings((prev) =>
        prev.filter((item) => item.id !== listingToDelete.id)
      )
      setExploreListings((prev) =>
        prev.filter((item) => item.id !== listingToDelete.id)
      )

      toast.show('Listing successfully deleted', {
        type: 'success',
        placement: 'top',
      })

      fetchListings()
    } catch (error) {
      console.error('Delete listing error:', error)
      toast.show('Failed to delete listing', {
        type: 'danger',
        placement: 'top',
      })
    } finally {
      setListingToDelete(null)
    }
  }

  const handleFavorite = async (id: string) => {
    try {
      // Find the listing in any of our arrays
      const listing = [...myListings, ...exploreListings].find(
        (item) => Number(item?.id) === Number(id)
      )

      if (!listing) return

      // Toggle the favorite status locally first for immediate feedback
      const newFavoriteStatus = !listing.isFavorite

      // Update local state for both listing arrays
      const updateFavorites = (list: ListingAttributes[]) =>
        list.map((item) =>
          Number(item?.id) === Number(id)
            ? { ...item, isFavorite: newFavoriteStatus }
            : item
        )

      setMyListings((prev) => updateFavorites(prev))
      setExploreListings((prev) => updateFavorites(prev))

      // Then update on the backend
      await listingService.toggleFavorite(Number(id), newFavoriteStatus)

      toast.show(
        newFavoriteStatus
          ? 'Added to your interests'
          : 'Removed from your interests',
        { type: newFavoriteStatus ? 'success' : 'normal', placement: 'top' }
      )

      // Refresh listings to ensure UI is consistent
      fetchListings()
    } catch (error) {
      toast.show('Failed to update interest', {
        type: 'danger',
        placement: 'top',
      })
      // If API call fails, revert by fetching fresh data
      fetchListings()
    }
  }
  const handleViewAllListings = () => {
    // Set listing tab to my-listing
    setActiveListingTab('my-listing')
    // Update navbar active tab
    setCurrentNavTab('/listing')
    router.push('/listing')
  }

  const handleViewAllNearby = () => {
    // Set listing tab to browse
    setActiveListingTab('browse')
    // Update navbar active tab
    setCurrentNavTab('/listing')
    router.push('/listing')
  }

  const handleViewAllConsultants = () => {
    // Update navbar active tab
    setCurrentNavTab('/consultants')
    router.push('/consultants')
  }

  const handleConsultantPress = (id: string) => {
    router.push(`/consultant/${id}`)
  }

  const handleViewInvestors = () => {
    // Update navbar active tab
    setCurrentNavTab('/investors')
    router.push('/investors')
  }

  // Get current user ID and load listings when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true)
        console.log('[DashboardScreen] Getting current user data...')

        // Get current user ID from auth service
        const currentUserId = await getCurrentUserId()
        console.log('[DashboardScreen] Current user ID:', currentUserId)

        if (currentUserId) {
          setUserId(String(currentUserId))

          // Get complete user profile data from API
          const userProfile = await userService.getUserProfile()
          console.log('[DashboardScreen] User profile loaded:', userProfile)

          if (userProfile) {
            // Extract name parts - either from name field or split the full name
            let firstName = ''
            let lastName = ''

            if (userProfile.name) {
              const nameParts = userProfile.name.split(' ')
              firstName = nameParts[0] || ''
              lastName =
                nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
            }

            setUserData({
              firstName,
              lastName,
              // Use profile image if available, otherwise fallback to mock
              profileImage: userProfile.profile?.imageUrl,
              // mockUserProfile[0].profileImage,
            })

            console.log('[DashboardScreen] User data set:', firstName, lastName)
          }
        }
      } catch (error) {
        console.error('[DashboardScreen] Error getting current user:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserData()
  }, [])

  // Load listings when userId is available
  useEffect(() => {
    fetchListings()
  }, [userId])

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true)
    try {
      console.log('==== Fetching Dashboard Listings ====')
      console.log('Current userId:', userId)

      // Get all listings without filters
      const allListings = (await listingService.getAllListings(
        {}
      )) as unknown as Listing[]
      console.log(
        `Received ${allListings?.length || 0} listings from getAllListings API`
      )

      if (userId) {
        // Get user's own listings for "Your Listings" section
        const userListings = (await listingService.getMyListings(
          Number(userId)
        )) as unknown as Listing[]
        console.log(
          `Received ${userListings?.length || 0} user listings from getMyListings API`
        )

        // Set my listings for "Your Listings" section (up to 3)
        setMyListings(
          userListings.slice(0, 3).map((listing) => listing.attributes)
        )

        // Explore listings are all listings that aren't owned by current user
        // Using the Strapi v4 structure to access the user ID
        const filteredExploreListings = allListings.filter((listing) => {
          // Access user ID from Strapi v4's nested structure
          const listingUserId = (listing as any).attributes
            ?.users_permissions_user?.data?.id

          // Keep listing if no user ID or if owner is different from current user
          return (
            listingUserId === undefined ||
            String(listingUserId) !== String(userId)
          )
        })

        // Set explore listings for "Explore Nearby Listing" section (limited to 2 cards)
        setExploreListings(
          filteredExploreListings
            .slice(0, 2)
            .map((listing) => listing.attributes)
        )
      } else {
        // If no user ID, just show some random listings
        setExploreListings(
          allListings.slice(0, 4).map((listing) => listing.attributes)
        )
      }
    } catch (error) {
      console.error('Error in fetchListings:', error)
      toast.show(
        error instanceof Error ? error.message : 'Failed to load listings',
        { type: 'danger', placement: 'top' }
      )
    } finally {
      setLoading(false)
      console.log('Finished fetching dashboard listings')
    }
  }

  return (
    <GuardedScreen
      isLoading={isLoading}
      canAccess={canAccess}
      loadingText="Loading dashboard..."
      accessDeniedText="Redirecting to login...">
      <SafeAreaView style={tw`flex-1`}>
        {activeMenu !== null && (
          <TouchableOpacity
            style={tw`absolute left-0 top-0 right-0 bottom-0 z-0`}
            activeOpacity={0}
            onPress={() => setActiveMenu(null)}
          />
        )}

        <ConfirmationModal
          visible={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setListingToDelete(null)
          }}
          onConfirm={confirmDeleteListing}
          title="Delete Listing"
          message={`Are you sure you want to delete "${listingToDelete?.title || ''}"? This action cannot be undone.`}
          confirmText="Delete Listing"
          confirmStyle="danger"
          icon="trash-2"
        />
        <View style={tw`flex-1`}>
          <ScrollView style={tw`flex-1`}>
            <View style={tw`pt-4 bg-white px-4 pb-8`}>
              <UserGreeting
                name={
                  isLoadingUser
                    ? 'Loading...'
                    : `${userData.firstName} ${userData.lastName}`
                }
                avater={userData.profileImage}
                subtitle="What would you like to consult today?"
                onNotificationPress={() => {}}
              />
              <View style={tw`py-4`}>
                <SearchInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search listings..."
                  onFilterPress={() => setShowFilterModal(true)}
                />
              </View>
              <View style={tw`pb-4`}>
                <View style={tw`flex-row justify-between gap-3`}>
                  <TouchableOpacity
                    onPress={handleViewAllListings}
                    style={tw`flex-1`}>
                    <StatCard
                      label="Active Listings"
                      value={myListings.length.toString()}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleViewInvestors}
                    style={tw`flex-1`}>
                    <StatCard
                      label="Investor Inquiries"
                      value={myListings.length.toString()}
                    />
                  </TouchableOpacity>
                </View>

                <View style={tw`mb-6`}>
                  <SectionHeader
                    title="Your Listings"
                    onViewAll={handleViewAllListings}
                  />
                  {loading ? (
                    <View style={tw`items-center justify-center py-8`}>
                      <ActivityIndicator
                        size="large"
                        color={colors.primary.DEFAULT}
                      />
                      <Text style={tw`mt-2 text-gray-500`}>
                        Loading your listings...
                      </Text>
                    </View>
                  ) : myListings.length > 0 ? (
                    <View style={tw`w-full mb-4 relative`}>
                      <ListingCard
                        listing={myListings[0]}
                        onPress={() => handleListingPress(myListings[0].id)}
                        onMenuPress={() => handleMenuPress(myListings[0])}
                      />
                      {activeMenu === myListings[0].id && (
                        <View
                          style={[
                            tw`absolute right-2 top-16 bg-white shadow-md rounded-md z-10`,
                            { minWidth: 120 },
                          ]}>
                          <TouchableOpacity
                            style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}
                            onPress={() => handleEdit(myListings[0])}>
                            <Feather
                              name="edit-2"
                              size={16}
                              color="#4B5563"
                              style={tw`mr-2`}
                            />
                            <Text style={tw`text-gray-700`}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={tw`flex-row items-center px-4 py-3`}
                            onPress={() => handleDelete(myListings[0])}>
                            <Feather
                              name="trash-2"
                              size={16}
                              color="#4B5563"
                              style={tw`mr-2`}
                            />
                            <Text style={tw`text-gray-700`}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View
                      style={tw`items-center justify-center py-8 bg-gray-50 rounded-lg`}>
                      <Text style={tw`text-center text-gray-500`}>
                        You don&apos;t have any listings yet
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={[tw`mb-4 font-medium`, { color: colors.gray[600] }]}>
                  <SectionHeader
                    title="Explore Nearby Listing"
                    onViewAll={handleViewAllNearby}
                  />

                  {loading ? (
                    <View style={tw`items-center justify-center py-8`}>
                      <ActivityIndicator
                        size="large"
                        color={colors.primary.DEFAULT}
                      />
                      <Text style={tw`mt-2 text-gray-500`}>
                        Loading listings...
                      </Text>
                    </View>
                  ) : exploreListings.length > 0 ? (
                    <View
                      style={tw`flex flex-wrap flex-row justify-between mb-4`}>
                      {exploreListings.map((listing) => (
                        <View key={listing.id} style={tw``}>
                          <CompactListingCard
                            listing={listing}
                            onPress={() => handleListingPress(listing.id)}
                            onFavorite={() =>
                              handleFavorite(listing.id.toString())
                            }
                            isFavorite={listing.isFavorite}
                          />
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View
                      style={tw`items-center justify-center py-8 bg-gray-50 rounded-lg`}>
                      <Text style={tw`text-center text-gray-500`}>
                        No listings available
                      </Text>
                    </View>
                  )}
                </View>

                <View style={tw`mb-4`}>
                  <SectionHeader
                    title="Top Consultants"
                    onViewAll={handleViewAllConsultants}
                  />

                  <View style={tw`flex-row justify-between mb-8`}>
                    {consultants.map((item: Consultant) => (
                      <ConsultantProfile
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        onPress={() => handleConsultantPress(item.id)}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* Custom Bottom Navbar - Fixed at bottom */}
          <View style={tw`absolute bottom-0 left-0 right-0 px-4`}>
            <Navbar />
          </View>
        </View>

        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={(filters) => {
            setFilterValues(filters)
            setShowFilterModal(false)
            // Here you can apply the filters to your listings
            console.log('Applied filters:', filters)
          }}
          initialFilters={filterValues}
        />
      </SafeAreaView>
    </GuardedScreen>
  )
}
