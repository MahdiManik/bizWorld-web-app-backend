import { CompactListingCard } from '@/components/Listing/CompactListingCard'
import { SearchInput } from '@/components/Listing/SearchInput'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { ScrollView, Text, ActivityIndicator, View } from 'react-native'
import { Listing } from 'types/listing'
import { listingService } from '@/services/listing.service'
import { useToast } from '@/utils/toast'
import { colors } from '@/constants/colors'

export default function MyFavorites() {
  const router = useRouter()
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch favorite listings from the API
  useEffect(() => {
    fetchFavoriteListings()
  }, [])

  const fetchFavoriteListings = async () => {
    setLoading(true)
    try {
      // Get all listings
      const allListings = await listingService.getAllListings({})

      // Filter only favorites
      const favoriteListings = allListings.filter(
        (listing) => listing.isFavorite
      )
      console.log(`Found ${favoriteListings.length} favorite listings`)

      // Convert ListingAttributes[] to Listing[] by wrapping each item in the required structure
      const mappedListings = favoriteListings.map(item => ({
        id: item.id,
        attributes: item
      }));
      setListings(mappedListings)
    } catch (error) {
      console.error('Error fetching favorite listings:', error)
      toast.show('Failed to load favorite listings', {
        type: 'danger',
        placement: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async (id: string) => {
    try {
      // Find the listing in our array
      const listing = listings.find((item) => item.id === id)
      if (!listing) return

      // Toggle the favorite status locally first for immediate feedback
      const newFavoriteStatus = !listing.attributes.isFavorite

      // Update local state
      setListings((prevListings) =>
        prevListings.map((item) =>
          item.id === id ? { ...item, attributes: { ...item.attributes, isFavorite: newFavoriteStatus } } : item
        )
      )

      // If removing from favorites, also remove from the list
      if (!newFavoriteStatus) {
        // Wait a brief moment to show the toggle animation before removing
        setTimeout(() => {
          setListings((prevListings) =>
            prevListings.filter((item) => item.id !== id)
          )
        }, 300)
      }

      // Update on the backend
      await listingService.toggleFavorite(Number(id), newFavoriteStatus)

      toast.show(
        newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        { type: newFavoriteStatus ? 'success' : 'normal', placement: 'top' }
      )
    } catch (error) {
      console.error(`Error updating favorite status for listing ${id}:`, error)
      toast.show('Failed to update favorites', {
        type: 'danger',
        placement: 'top',
      })

      // Refresh the list to ensure consistency
      fetchFavoriteListings()
    }
  }

  const handleListingPress = (id: string | number) => {
    console.log('Navigating to listing with ID:', id)
    // Convert ID to string to ensure consistency
    const stringId = String(id)
    router.push(`/listing/${stringId}`)
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-1`}>
          <View style={tw`pb-2`}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search..."
              onFilterPress={() => setShowFilterModal(true)}
            />
          </View>
          {loading ? (
            <View style={tw`items-center justify-center py-8`}>
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
              <Text style={tw`mt-2 text-gray-500`}>
                Loading your favorites...
              </Text>
            </View>
          ) : listings.length > 0 ? (
            <View >
              {listings.map((item) => (
                <View style={tw`mb-4`} key={item.id}>
                  <CompactListingCard
                    listing={item.attributes}
                    onPress={() => handleListingPress(String(item.id))}
                    onFavorite={() => handleFavorite(String(item.id))}
                    isFavorite={item.attributes.isFavorite}
                    fullWidth={true}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View
              style={tw`items-center justify-center py-8 bg-gray-50 rounded-lg mx-4`}>
              <Text style={tw`text-center text-gray-500`}>
                You don't have any favorite listings yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
