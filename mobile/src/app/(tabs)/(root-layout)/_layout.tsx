import React from 'react'
import { Stack } from 'expo-router/stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, TouchableOpacity } from 'react-native'
import Navbar from '@/components/Navbar'
import { useRouter } from 'expo-router'
import { usePathname, useSegments } from 'expo-router/build/hooks'
import tw from '@/lib/tailwind'
import { Header } from '@/components/Listing/Header'
import { useChatContext, ChatProvider } from '@/contexts/ChatContext'
import { SimpleLineIcons } from '@expo/vector-icons'
import { ListingProvider } from '@/contexts/ListingContext'
import { AuthProvider } from '@/contexts/AuthContext'
function AppLayoutContent() {
  const router = useRouter()
  const pathname = usePathname()
  const segments = useSegments()
  const { selectedUser, isInChatConversation, setSelectedUser } =
    useChatContext()

  // Determine if we should show back button based on the path
  const isMainListingPage =
    pathname === '/listing' ||
    pathname === '/listing/' ||
    pathname === '/dashboard' ||
    pathname === '/dashboard/' ||
    pathname.includes('/investors') ||
    pathname === '/account-settings' ||
    pathname === '/account-settings/'

  // Determine the page title based on the path
  const getPageTitle = () => {
    // If in a chat conversation, show the user's name
    if (pathname.includes('/chat') && isInChatConversation && selectedUser) {
      return selectedUser.name
    }

    // Check if we're in a listing detail page (check for numeric ID in segments)
    if (
      segments.length > 0 &&
      segments[segments.length - 1] &&
      !isNaN(Number(segments[segments.length - 1]))
    ) {
      return 'Information'
    }

    if (pathname.includes('/chat')) return 'Inbox'
    if (pathname.includes('/account-settings/services')) return 'Services'
    if (pathname.includes('/account-settings/personal-info'))
      return 'Personal Info'
    if (pathname.includes('/account-settings/change-pass'))
      return 'Change Password'
    if (pathname.includes('/account-settings/company-info'))
      return 'Company Information'
    if (pathname.includes('/account-settings/consultant-application'))
      return 'Consultant Application'
    if (pathname.includes('/account-settings/edit-company'))
      return 'Edit Company'
    if (pathname.includes('/account-settings/edit-info'))
      return 'Edit Information'
    if (pathname.includes('/account-settings/notifications'))
      return 'Notification Settings'
    if (pathname.includes('/account-settings/my-favorites'))
      return 'My Favorites'
    if (pathname.includes('/request-consultant')) return 'Request Consultant'
    if (pathname.includes('/account-settings/subscription/all-plans'))
      return 'All Plans'
    if (pathname.includes('/account-settings/subscription/upgrade-plan'))
      return 'Upgrade Plan'
    if (pathname.includes('/account-settings/subscription/payment-history'))
      return 'Payment History'
    if (pathname.includes('/account-settings/subscription/upgrade-pro'))
      return 'Upgrade Pro'
    if (pathname.includes('/account-settings/subscription'))
      return 'Subscription'
    if (pathname.includes('/account-settings')) return 'Account Settings'
    if (pathname.includes('/consultants')) return 'Consultants'
    if (pathname.includes('/consultant-request')) return 'Request Consultant'
    if (pathname.includes('/investors')) return 'Investor'
    if (pathname.includes('/add-listing')) return 'Add New Listing'
    if (pathname.includes('/edit-listing')) return 'Edit Listing'
    if (pathname.includes('/listing/') && pathname !== '/listing/')
      return 'Information'
    return 'Listings'
  }

  const handleBackPress = () => {
    // If in chat conversation, go back to chat list
    if (pathname.includes('/chat') && isInChatConversation) {
      setSelectedUser(null)
      return
    }

    // Special handling for subscription-related pages to preserve the navigation flow
    if (pathname.includes('/account-settings/subscription/all-plans')) {
      router.push('/account-settings/subscription/upgrade-pro')
      return
    }
    if (pathname.includes('/account-settings/subscription/upgrade-pro')) {
      router.push('/account-settings/subscription')
      return
    }
    if (pathname.includes('/account-settings/subscription/upgrade-plan')) {
      router.push('/account-settings/subscription')
      return
    }
    if (pathname.includes('/account-settings/subscription/payment-history')) {
      router.push('/account-settings/subscription')
      return
    }

    // For other account settings subpages, go back to account settings main page
    if (pathname.includes('/account-settings/')) {
      router.push('/account-settings')
      return
    }

    // For consultant-related pages, go back to consultants list
    if (pathname.includes('/consultant-request')) {
      router.push('/consultants')
      return
    }

    // For listing subpages, go back to listing main page
    if (pathname.includes('/listing/')) {
      router.push('/listing')
      return
    }

    // Default fallback is dashboard (home page)
    router.push('/dashboard')
  }

  // Custom icon for chat conversation back button
  const renderCustomLeftIcon = () => {
    if (pathname.includes('/chat') && isInChatConversation) {
      return (
        <TouchableOpacity onPress={handleBackPress}>
          <SimpleLineIcons name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
      )
    }
    return null
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white `}>
      <Header
        title={getPageTitle()}
        showBackButton={!isMainListingPage}
        onBackPress={handleBackPress}
        onNotificationPress={() => console.log('Notification pressed')}
        customLeftIcon={renderCustomLeftIcon()}
      />
      <View style={tw`flex-1 justify-between px-4`}>
        {/* Stack Navigator */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        {/* Custom Bottom Navbar */}
        <Navbar />
      </View>
    </SafeAreaView>
  )
}

export default function AppLayout() {
  return (
    <ChatProvider>
      <ListingProvider>
        <AuthProvider>
          <AppLayoutContent />
        </AuthProvider>
      </ListingProvider>
    </ChatProvider>
  )
}
