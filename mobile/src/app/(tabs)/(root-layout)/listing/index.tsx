/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* ListingsScreen.tsx – cleaned / context‑driven */
import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tw from '@/lib/tailwind'
import { SearchInput } from '@/components/Listing/SearchInput'
import { CategoryPills } from '@/components/Listing/CategoryPills'
import { FloatingActionButton } from '@/components/Listing/FloatingActionButton'
import { CompactListingCard } from '@/components/Listing/CompactListingCard'
import { ListingCard } from '@/components/Listing/ListingCard'
import { InterestListingCard } from '@/components/Listing/InterestListingCard'
import { ConfirmationModal } from '@/components/profileSettings/ConfirmationModal'
import { useToast } from 'react-native-toast-notifications'
import { Listing, ListingCreateInput } from '@/types/listing'
import { getActiveListingTab } from '@/utils/navigationState'
import { useAuth } from '@/contexts/AuthContext'
import { useListings } from '@/contexts/ListingContext'
import { colors } from '@/constants/colors'

// -----------------------------------------------------------------------------
// Static data
// -----------------------------------------------------------------------------
const statusCategories = [
  { id: 'all', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
]

const businessCategories = [
  { id: 'all', label: 'All' },
  { id: 'ECOMMERCE', label: 'E‑commerce' },
  { id: 'MOBILE', label: 'Mobile App' },
]

const tabs = [
  { id: 'browse', label: 'Browse Listings' },
  { id: 'my-listing', label: 'My Listings' },
  { id: 'my-interest', label: 'My Interests' },
]

// -----------------------------------------------------------------------------
export default function ListingsScreen() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const {
    listings,
    myListings,
    loading,
    fetchListings,
    fetchMyListings,
    deleteListing,
    toggleFavorite,
  } = useListings()

  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('browse')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null)
  const [myInterests, setMyInterests] = useState<Listing[]>([])

  // --------------------------------------------------------- initial tab
  useEffect(() => {
    const t = getActiveListingTab()
    if (t && tabs.some((tab) => tab.id === t)) setActiveTab(t)
  }, [])

  // --------------------------------------------------------- load listings
  useEffect(() => {
    const run = async () => {
      try {
        const filter =
          selectedCategory !== 'all'
            ? { category: selectedCategory.toUpperCase() }
            : {}
        await fetchListings(filter)
        if (user?.id) await fetchMyListings(user.id)
      } catch (err) {
        toast.show('Failed to load listings', {
          type: 'danger',
          placement: 'top',
        })
      }
    }
    run()
  }, [selectedCategory, user?.id])

  // --------------------------------------------------------- load interests
  useEffect(() => {
    const getInterests = async () => {
      const stored = await AsyncStorage.getItem('interestListingIds')
      const ids: string[] = stored ? JSON.parse(stored) : []
      const items = listings.filter((l) => ids.includes(l.id.toString()))
      setMyInterests(items)
    }
    getInterests()
  }, [listings])

  // ✅ Fetch My Listings only when user.id is ready
  useEffect(() => {
    if (user?.id) {
      fetchMyListings(user.id)
    }
  }, [user?.id])

  // ✅ Derived Listings
  const current = useMemo(() => {
    let base: Listing[] = []

    if (activeTab === 'browse') {
      base = listings.filter((listing) => {
        const listingUserId = listing?.user?.id
        const currentUserId = user?.id
        return !listingUserId || String(listingUserId) !== String(currentUserId)
      })
    } else if (activeTab === 'my-listing') {
      base = myListings
    } else {
      base = myInterests
    }

    return base.filter((l) => {
      const searchOK =
        !searchQuery ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase())

      const catOK =
        selectedCategory === 'all' ||
        l.category?.toUpperCase() === selectedCategory.toUpperCase()

      const statusOK =
        activeTab !== 'my-interest' ||
        selectedStatus === 'all' ||
        (l.status && l.status.toUpperCase() === selectedStatus.toUpperCase())

      return searchOK && catOK && statusOK
    })
  }, [
    activeTab,
    listings,
    myListings,
    myInterests,
    searchQuery,
    selectedCategory,
    selectedStatus,
    user?.id,
  ])

  // --------------------------------------------------------- handlers
  const pressListing = (id: number) => router.push(`/listing/${id}`)

  const favListing = async (id: number) => {
    try {
      const item = [...listings, ...myListings, ...myInterests].find(
        (l) => l.id === id
      )
      if (!item) return
      await toggleFavorite(id, !item.isFavorite)
    } catch {
      toast.show('Could not update favorite', {
        type: 'danger',
        placement: 'top',
      })
    }
  }

  const longPressListing = (l: Listing) => {
    if (activeTab !== 'my-listing') return
    setListingToDelete(l)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!listingToDelete) return
    try {
      await deleteListing(listingToDelete.id)
      toast.show('Listing deleted', { type: 'success', placement: 'top' })
    } catch {
      toast.show('Delete failed', { type: 'danger', placement: 'top' })
    } finally {
      setShowDeleteModal(false)
      setListingToDelete(null)
    }
  }

  // --------------------------------------------------------- render item
  const renderItem = React.useCallback(
    ({ item }: { item: ListingCreateInput }) => {
      if (activeTab === 'my-interest')
        return (
          <InterestListingCard
            listing={item}
            onMessageOwner={() => pressListing(item.id)}
            currentUserId={user?.id ?? null}
          />
        )

      if (activeTab === 'my-listing')
        return (
          <ListingCard
            listing={item}
            onPress={() => pressListing(item.id)}
            onMenuPress={() => longPressListing(item)}
          />
        )

      return (
        <CompactListingCard
          listing={item}
          onPress={() => pressListing(item.id)}
          onFavorite={() => favListing(item.id)}
        />
      )
    },
    [activeTab, user?.id]
  )

  // --------------------------------------------------------- UI
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Tabs */}
      <View style={tw`flex-row w-full border-b border-gray-300`}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setActiveTab(t.id)}
            style={tw`flex-1 items-center py-3`}>
            <View style={tw`relative`}>
              <Text
                style={[
                  tw`text-center font-medium`,
                  activeTab === t.id
                    ? { color: colors.primary.DEFAULT }
                    : tw`text-gray-500`,
                ]}>
                {t.label}
              </Text>
              {activeTab === t.id && (
                <View
                  style={[
                    tw`absolute bottom-0 top-7 left-0 right-0 h-0.5`,
                    { backgroundColor: colors.primary.DEFAULT },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top controls */}
      {activeTab !== 'my-interest' && (
        <View style={tw`pt-2`}>
          <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
          <CategoryPills
            categories={businessCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </View>
      )}

      {activeTab === 'my-interest' && (
        <View style={tw`pt-2`}>
          <CategoryPills
            categories={statusCategories}
            selectedCategory={selectedStatus}
            onCategorySelect={setSelectedStatus}
          />
        </View>
      )}

      {/* List */}
      {current.length ? (
        <FlatList
          key={`${activeTab}-${current.length}`} // Add key that changes when layout needs to update
          data={current}
          keyExtractor={(i: Listing) => i.id.toString()}
          renderItem={renderItem}
          numColumns={activeTab === 'browse' ? 2 : 1}
          contentContainerStyle={tw`pb-24`}
          refreshing={loading}
          onRefresh={() =>
            fetchListings(
              selectedCategory !== 'all'
                ? { category: selectedCategory.toUpperCase() }
                : {}
            )
          }
          {...(activeTab === 'browse' && {
            columnWrapperStyle: tw`justify-between`,
          })}
        />
      ) : (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-500`}>No listings found.</Text>
        </View>
      )}

      {/* FAB for creating listing */}
      {activeTab === 'my-listing' && (
        <FloatingActionButton
          onPress={() => router.push('/listing/add-listing')}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Listing"
        message="This action cannot be undone."
        confirmText="Delete"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  )
}
